//Core
import React, { useRef, useState, useLayoutEffect, useEffect } from 'react';
import { Image, Layer, Stage } from 'react-konva';

//Components
import View3d from '../3d/View3d';
import Rectangle from '../3d/Rectangle';
import Cropper from '../3d/Cropper';

//Hooks
import { useTranslation } from 'react-i18next';
import { useOrder } from '../../contexts/OrderContext';

//Utils
import useImage from 'use-image';
import { createGuid } from '../../core/helpers/guidHelper';
import {
  getScaleDownFactor,
  getScaleUpFactor,
  getPointTransformation,
  getRectTransformation,
  getRectOrientTransformation,
} from '../../core/helpers/imageTransformationHelper';

//UI
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';
import Typography from '@material-ui/core/Typography';

//Assets
import defaultObj from '../../assets/cup.obj';
import sampleImg from '../../assets/sample01.jpg';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    minHeight: '80px',
  },
  centerVertical: {
    display: 'flex',
    alignItems: 'center',
  },
  centerHorizontal: {
    display: 'flex',
    justifyContent: 'center',
  },
  stepperContainer: {
    display: 'flex',
  },
  thumbImage: {
    width: '100%',
    maxWidth: '100px',
    height: '100%',
    maxHeight: '60px',
    marginTop: '4px',
  },
  thumbImageSelected: {
    width: '100%',
    maxWidth: '100px',
    height: '100%',
    maxHeight: '60px',
    marginTop: '4px',
    border: 'solid 2px blue',
  },
}));

const OtherButton = withStyles((theme) => ({
  root: {
    width: '100%',
    marginBottom: '12px',
    maxWidth: '400px',
    color: '#28a745',
    borderRadius: '50px',
    padding: '12px 28px',
    border: '1px solid #28a745',
    '&:hover': {
      color: 'white',
      backgroundColor: '#28a745',
    },
    w100: {
      width: '100%',
    },
    canvasWrapper: {
      width: '100% !important',
      height: '200px !important',
      minHeight: '160px',
    },
  },
}))(Button);

const Presenter3d = ({ product, pack }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const stageLayerRef = useRef(null);

  const [order, orderDispatch] = useOrder();
  const [textureUrl, setTextureUrl] = useState(null);
  const [showEditor, setShowEditr] = useState(false);
  const [selectedMode, setSelectedMode] = useState(true);
  const [rectangles, setRectangles] = useState([]);

  const [activeStep, setActiveStep] = React.useState(0);

  const [image, status] = useImage(product.layerImageUrl, 'anonymous');

  function getSteps() {
    const images = order.orderItems.filter(
      (i) => i.productId === product.id && i.isLayerItem === true
    );

    return [...images];
  }

  function getSelectedOrderItem() {
    const steps = getSteps();
    return steps[activeStep];
  }

  function getSelectedCropConfig() {
    if (!product) return null;
    const { sizes } = product;
    if (!sizes) return null;

    return product.sizes[activeStep];
  }

  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  const steps = getSteps();

  const scale = 0.4215686275;
  var container = document.querySelector('#js-stage-root');
  let widthValue = container?.offsetWidth ?? 1122;

  if (widthValue > 561) widthValue = 561;
  const heightValue = widthValue * scale;

  const getModelUrl = () => {
    if (!product.objUrl) return defaultObj;

    //hack: for sake of development
    if (product.objUrl?.length < 10) return defaultObj;

    return product.objUrl;
  };

  function saveTexture(model) {
    const trackingGuid = createGuid();
    const newOrderItem = {
      maxSize: product.size,
      guid: trackingGuid,
      fileAsBase64: model.fileAsBase64,
      fileUrl: '',
      fileName: trackingGuid,
      productId: product.id,
      set: pack,
      qty: 1,
      status: 'idle',
    };

    orderDispatch({ type: 'ADD_ORDER_ITEM_TEXTURE_3D', payload: newOrderItem });
  }

  useLayoutEffect(() => {
    const { sizes } = product;

    //scale factor section:
    let scaleFactorDown = 1;
    let scaleFactorUp = 1;

    function calculateScaleFactors() {
      if (status !== 'loaded') return;

      var downFactor = getScaleDownFactor(image.width, widthValue);
      if (downFactor > 0) scaleFactorDown = downFactor;

      var upFactor = getScaleUpFactor(image.width, widthValue);
      if (upFactor > 0) scaleFactorUp = upFactor;
    }
    calculateScaleFactors();

    const images = order.orderItems.filter(
      (i) => i.productId === product.id && i.isLayerItem === true
    );
    const layers = images.map((img, index) => {
      let tempLayer;

      if (!img.layerConfig) {
        var windowScaled = getRectTransformation(
          sizes[index].positionX,
          sizes[index].positionY,
          sizes[index].width,
          sizes[index].height,
          scaleFactorDown
        );
        var rect_scaled = getRectOrientTransformation(
          {
            x: windowScaled.x,
            y: windowScaled.y,
            width: img.width,
            height: img.height,
          },
          {
            x: windowScaled.x,
            y: windowScaled.y,
            width: windowScaled.w,
            height: windowScaled.h,
          }
        );

        const newConfig = {
          guid: img.guid,
          index: index,
          x: rect_scaled.x,
          y: rect_scaled.y,
          width: rect_scaled.w,
          height: rect_scaled.h,
          scaled: scaleFactorDown !== 1 ? true : false,
        };
        tempLayer = { ...newConfig };

        orderDispatch({
          type: 'UPDATE_ORDER_ITEM_TEXTURE_CONFIG',
          payload: newConfig,
        });
      } else if (img.layerConfig.scaled === false && status == 'loaded') {
        var windowRescaled = getRectTransformation(
          sizes[index].positionX,
          sizes[index].positionY,
          sizes[index].width,
          sizes[index].height,
          scaleFactorDown
        );

        var rect_rescaled = getRectOrientTransformation(
          {
            x: windowRescaled.x,
            y: windowRescaled.y,
            width: img.width,
            height: img.height,
          },
          {
            x: windowRescaled.x,
            y: windowRescaled.y,
            width: windowRescaled.w,
            height: windowRescaled.h,
          }
        );

        const newConfig = {
          guid: img.guid,
          index: index,
          x: rect_rescaled.x,
          y: rect_rescaled.y,
          width: rect_rescaled.w,
          height: rect_rescaled.h,
          scaled: true,
          scaleFactorDown: scaleFactorDown,
          scaleFactorUp: scaleFactorUp,
        };
        tempLayer = { ...newConfig };

        orderDispatch({
          type: 'UPDATE_ORDER_ITEM_TEXTURE_CONFIG',
          payload: newConfig,
        });
      } else {
        tempLayer = { ...img.layerConfig };
      }
      tempLayer.url = img.fileUrl;

      return tempLayer;
    });

    setRectangles([...layers]);
    const uri = stageLayerRef.current.toDataURL();
    setTextureUrl(uri);
  }, [image, order.orderItems, orderDispatch, product, status, widthValue]);

  useEffect(() => {
    const uri = stageLayerRef.current.toDataURL();
    setTextureUrl(uri);
  }, []);

  function getOrderItem() {
    if (!order) return null;
    const { orderItems } = order;
    if (!orderItems) return null;

    const item = orderItems.find(
      (x) => x.productId == product.id && !x.isLayerItem
    );
    return item;
  }

  const handleAddQuantity = () => {
    const item = getOrderItem();
    if (!item) return;

    orderDispatch({
      type: 'INCREASE_ORDER_ITEM_QTY',
      payload: { guid: item.guid },
    });
  };

  const handleRemoveQuantity = () => {
    const item = getOrderItem();
    if (!item) return;
    orderDispatch({
      type: 'DECRESE_ORDER_ITEM_QTY',
      payload: { guid: item.guid },
    });
  };

  function getQuantity() {
    const item = getOrderItem();
    if (!item) return 0;

    return item.qty;
  }

  return (
    <>
      {!showEditor && (
        <View3d
          textureUrl={textureUrl}
          modelUrl={getModelUrl()}
          saveFn={saveTexture}
        />
      )}

      <Box
        style={{
          width: '100%',
        }}
      >
        {showEditor && (
          <>
            <div>
              <div className={classes.centerVertical}>
                <Typography variant='h5' component='span'>
                  {t('Select file to CROP')}
                </Typography>
              </div>
              <Stepper alternativeLabel nonLinear activeStep={activeStep}>
                {steps.map((step, index) => {
                  const stepProps = {};
                  const buttonProps = {};
                  if (step.fileUrl) {
                    buttonProps.optional = (
                      <img
                        src={step.fileUrl}
                        alt={step.fileName}
                        className={
                          index == activeStep
                            ? classes.thumbImageSelected
                            : classes.thumbImage
                        }
                      />
                    );
                  }
                  return (
                    <Step key={step.guid} {...stepProps}>
                      <StepButton
                        onClick={handleStep(index)}
                        // completed={isStepComplete(index)}
                        {...buttonProps}
                      >
                        {/* {label} */}
                      </StepButton>
                    </Step>
                  );
                })}
              </Stepper>
            </div>
            <div className={classes.centerHorizontal}>
              {steps.map((step, index) => {
                const key = step.guid;
                return (
                  <Cropper
                    uniqKey={key}
                    display={index == activeStep}
                    orderItem={getSelectedOrderItem()}
                    cropConfig={getSelectedCropConfig()}
                  />
                );
              })}
            </div>
          </>
        )}
        <div id='js-stage-root' className={classes.w100}>
          <Stage
            width={widthValue}
            height={heightValue}
            onMouseDown={() => setSelectedMode(true)}
            onTouchStart={() => setSelectedMode(true)}
            style={{
              border: '5px solid #ccc',
              margin: '10px auto',
              width: '100%',
              maxWidth: widthValue,
              height: '100%',
              maxHeight: heightValue,
              // display: 'none',
            }}
          >
            <Layer ref={stageLayerRef}>
              {rectangles.map((rect, i) => {
                return (
                  <Rectangle
                    key={i}
                    layer={rect}
                    isSelected={selectedMode}
                    onChange={(newAttrs) => {
                      const rects = rectangles.slice();
                      rects[i] = newAttrs;

                      orderDispatch({
                        type: 'UPDATE_ORDER_ITEM_TEXTURE_CONFIG_MULTI',
                        payload: rects,
                      });

                      setRectangles(rects);
                      const uri = stageLayerRef.current.toDataURL();
                      setTextureUrl(uri);
                    }}
                  />
                );
              })}
              <Image image={image} width={widthValue} height={heightValue} />
            </Layer>
            <Layer name='top-layer' />
          </Stage>
        </div>
      </Box>
      {showEditor && (
        <div className={classes.centerVertical}>
          <span>{t('Quantity')}:</span>
          <IconButton aria-label='delete' onClick={handleRemoveQuantity}>
            <RemoveCircleOutlineIcon />
          </IconButton>
          <span>{getQuantity()}</span>
          <IconButton aria-label='delete' onClick={handleAddQuantity}>
            <AddCircleOutlineIcon />
          </IconButton>
        </div>
      )}
      {!showEditor && (
        <OtherButton onClick={() => setShowEditr(true)} color='primary'>
          {t('Adjustment')}
        </OtherButton>
      )}
      {showEditor && (
        <OtherButton onClick={() => setShowEditr(false)} color='primary'>
          {t('Preview')}
        </OtherButton>
      )}
    </>
  );
};

export default Presenter3d;
