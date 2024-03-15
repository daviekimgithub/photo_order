//Core
import React, { useState, useEffect, useRef } from 'react';

//Components
import View3d from '../../3d/View3d';
import RoundButton from './../../core/RoundButton';

//Hooks
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useOrder } from '../../../contexts/OrderContext';

//Utils
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { createGuid } from '../../../core/helpers/guidHelper';

//UI
import AddPhotoAlternateOutlined from '@material-ui/icons/AddPhotoAlternateOutlined';
import Box from '@material-ui/core/Box';
import CachedIcon from '@material-ui/icons/Cached';
import DeleteOutlineOutlined from'@material-ui/icons/DeleteOutlineOutlined';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Divider from '@material-ui/core/Divider';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import CircularProgress from '@material-ui/core/CircularProgress';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';
import EditIcon from '@material-ui/icons/Edit';
import VisibilityIcon from '@material-ui/icons/Visibility';

import PhotoFrame from '../../PhotoFrame/PhotoFrame';

//Assets
import shareImg from '../../../assets/share2.jpg';
import { useStyles, NextButton, OtherButton} from './Buttons';


const Render3dWizard = ({ product, isOpen, closeFn, pack }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const history = useHistory();

  let fileInput = null;

  const [copied, setCopied] = useState(false);
  const [activeStep, setActiveStep] = React.useState(0);
  const [finalImage, setFinalImage] = useState(null);
  const [refresh, setRefresh] = useState(0);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [editorRef, setEditorRef] = useState();
  const [editorRatio, setEditorRatio] = useState(0);
  const [hideSelectors, setHideSelectors] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(-1);

  const [order, orderDispatch] = useOrder();

  const drawingCanvasRef = useRef(null);

  const handleNext = () => {
    closeFn();
    history.push(`/photographer/${product.photographerId}/checkout`);
  };

  const handleClose = () => {
    setIsShareOpen(false);
    closeFn();
  };

  function getOrderItem(items) {
    if (!items || items.length == 0) return null;

    const result = items.find(
      (i) =>
        i.productId == product.id && !i.isLayerItem && i.status == 'success'
    );

    return result;
  }

  function getProductConfig(i) {
    if (!product) return null;
    const { sizes } = product;
    if (!sizes) return null;

    return product.sizes[i];
  }

  const steps = React.useMemo(() => {
    function getSteps() {
      const images = order.orderItems.filter(
        (i) => i.productId === product.id && i.isLayerItem === true
      );
      images.forEach((s, index) => {
        const sizeConfig = getProductConfig(index);
        if (sizeConfig) s.productConfig = sizeConfig;
      });

      const editStep = {
        type: 'edit',
        data: images,
      };

      const previewStep = {
        type: 'preview',
        data: {},
      };

      return [editStep, previewStep];
    }

    const newSteps = getSteps();
    return newSteps;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order.orderItems]);

  useEffect(() => {
    let last = steps.length - 1;
    if (last < 0) last = 0;
    setActiveStep(0);
  }, [steps.length]);

  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  function saveTexture(model) {
    const trackingGuid = createGuid();
    const newOrderItem = {
      maxSize: product.size,
      guid: trackingGuid,
      fileAsBase64: model,
      fileUrl: '',
      fileName: `${trackingGuid}.jpg`,
      productId: product.id,
      set: pack,
      qty: 1,
      status: 'idle',
    };

    orderDispatch({ type: 'ADD_ORDER_ITEM_TEXTURE_3D', payload: newOrderItem });
    setIsShareOpen(true);
  }

  function handleCopy() {
    setCopied(true);
  }

  function isShareDisabled() {
    if (!order) return true;

    const { orderItems } = order;

    const item = getOrderItem(orderItems);
    if (!item) return true;

    return false;
  }

  function isAcceptUploading() {
    const { orderItems } = order;
    const acceptedItem = orderItems.find(
      (i) => i.productId == product.id && !i.isLayerItem
    );

    if (!acceptedItem) return false;

    if (acceptedItem.status == 'processing') return true;

    return false;
  }
  isAcceptUploading();
  function isThisLastStep() {
    if (steps.length == activeStep + 1) return true;

    return false;
  }

  function showAcceptButton() {
    const isShareDisabledResult = isShareDisabled();
    const last = activeStep + 1 >= steps.length;
    const result = last && isShareDisabledResult;

    return result;
  }

  const showShareButton = isThisLastStep();
  const showNextButton = isThisLastStep();

  const shareUrl = () => {
    const baseUrl = window.location.origin;
    const { photographerId } = product;
    const { id } = product;

    const item = getOrderItem(order.orderItems);
    const fullGuidUrl = item?.fileUrl ?? '';
    const storageUrl = `${process.env.REACT_APP_STORAGE_PATH}/customerorderphoto`;
    const shortGuid = fullGuidUrl.replace(`${storageUrl}/`, '');
    const encodedGuid = encodeURIComponent(shortGuid);

    return `${baseUrl}/share3d/${photographerId}/${id}/${encodedGuid}`;
  };

  const handleUploadClick = () => {
    fileInput.click();
  };
  const fileInputAddHandler = (event) => {
    // const limit = getMaxFileLimit();
    // const actual = getUploadedFilesCount();
    //
    // if (limit <= actual) return;

    const { files } = event.target;
    for (let i = 0; i < files.length; i++) {
      // if (actual + 1 + i > limit) return;
      const file = files[i];
      const trackingGuid = createGuid();
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        var tempImg = new Image();
        tempImg.src = reader.result;
        tempImg.onload = function () {
          const orderItem = {
            maxSize: product.size,
            guid: trackingGuid,
            fileAsBase64: reader.result,
            fileUrl: URL.createObjectURL(file),
            fileName: file.name,
            productId: product.id,
            set: pack,
            qty: 1,
            status: 'idle',
            isLayerItem: true,
            width: tempImg.width,
            height: tempImg.height,
          };
console.log("create img with id: ", trackingGuid)
          orderDispatch({ type: 'ADD_ORDER_ITEM_AT_END', payload: orderItem });
          // executeScroll();
        };
      };
    }
  };
  const fileInputUpateHandler = (e) => {
    const { files } = e.target;
    const newFile = files[0] ?? null;
    if (!newFile) return;

    const trackingGuid = createGuid();
    const reader = new FileReader();
    reader.readAsDataURL(newFile);
    const currentItem = steps[activeStep].data[selectedPhoto] ?? null;

    reader.onloadend = () => {
      var tempImg = new Image();
      tempImg.src = reader.result;
      tempImg.onload = function () {
        const orderItem = {
          oldGuid: currentItem.guid,
          newGuid: trackingGuid,
          maxSize: product.size,
          fileAsBase64: reader.result,
          fileUrl: URL.createObjectURL(newFile),
          fileName: newFile.name,
          productId: product.id,
          set: pack,
          qty: 1,
          status: 'idle',
          isLayerItem: true,
          width: tempImg.width,
          height: tempImg.height,
        };
        orderDispatch({ type: 'REPLACE_ORDER_ITEM', payload: orderItem });
      };
    };
  };

  useEffect(() => {
    const last = activeStep + 1 == steps.length;
    if (isOpen && last) {
      setTimeout(() => {
        setRefresh((prev) => prev + 1);
      }, 5000);
    }
  }, [steps.length, refresh, activeStep, isOpen]);

  const removeSelectedPhoto = () =>{
    setSelectedPhoto(null);
    orderDispatch({
      type: 'DECRESE_ORDER_ITEM_QTY',
      payload: { guid: steps[0].data[selectedPhoto].guid },
    });
  }

  return (
    <>
      <Dialog
        fullWidth={true}
        maxWidth={'lg'}
        open={isOpen ?? false}
        onClose={handleClose}
        scroll='paper'
      >
        <DialogContent>
          <Stepper alternativeLabel nonLinear activeStep={activeStep}>
            {steps.map((step, index) => {
              const stepProps = {};
              const buttonProps = {};
              if (step.type == 'edit' && step.data[0]?.fileUrl) {
                buttonProps.icon=(<EditIcon/>);
              }
              if (step.type == 'preview' && product.imageUrl) {
                buttonProps.icon=<VisibilityIcon/>;
              }
              if (step.type == 'share') {
                buttonProps.optional = (
                  <div
                    className={`${
                      index == activeStep
                        ? classes.thumbImageSelected
                        : classes.thumbImage
                    } ${classes.shareBox}`}
                  >
                    <DoneAllIcon />
                  </div>
                );
              }
              return (
                <Step key={step.data.guid} {...stepProps}>
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

          {steps.map((step, index) => {
            if (step.type == 'edit') {
              if(index === activeStep && finalImage){
                setHideSelectors(false);
                setFinalImage(null);
              }
              const stepImages = step.data.map(d=>(<img src={d.fileUrl} naturalWidth={d.width} naturalHeight={d.height}/>));
              const replaceFileBtn = (
                <div>
                  <input
                    type='file'
                    style={{ display: 'none' }}
                    inputprops={{ accept: 'image/*' }}
                    onChange={fileInputUpateHandler}
                    ref={(input) => {
                      fileInput = input;
                    }}
                  />
                  <RoundButton
                    size='small'
                    onClick={() => handleUploadClick()}
                    disabled={selectedPhoto<0}
                    className={
                      index == activeStep ? classes.visible : classes.hidden
                    }
                  >
                    <Box className={classes.centerContent}>
                      <CachedIcon />
                      <span>{t('Replace file')}</span>
                    </Box>
                  </RoundButton>
                </div>
              );
              const removeFileBtn = (
                <div>
                  <RoundButton
                    size='small'
                    onClick={() => removeSelectedPhoto()}
                    disabled={selectedPhoto<0}
                    className={
                      index == activeStep ? classes.visible : classes.hidden
                    }
                  >
                    <Box className={classes.centerContent}>
                      <DeleteOutlineOutlined />
                      <span>{t('Remove photo')}</span>
                    </Box>
                  </RoundButton>
                </div>
              )
              const addFloatingImageBtn = (
                <div>
                  <input
                    type='file'
                    style={{ display: 'none' }}
                    inputprops={{ accept: 'image/*' }}
                    onChange={fileInputAddHandler}
                    ref={(input) => {
                      fileInput = input;
                    }}
                  />
                  <RoundButton
                    size='small'
                    onClick={() => handleUploadClick()}
                    disabled={false}
                    className={
                      index == activeStep ? classes.visible : classes.hidden
                    }
                  >
                    <Box className={classes.centerContent}>
                      <AddPhotoAlternateOutlined />
                      <span>{t('Add photo')}</span>
                    </Box>
                  </RoundButton>
                </div>
              );
              return (
                <div className={ index == activeStep ? classes.visible : classes.hidden }>

                  <PhotoFrame
                    stepData={step.data}
                    frameUrl={product.layerImageUrl}
                    photos={stepImages}
                    hideSelectors={hideSelectors}
                    setSelectedPhoto={setSelectedPhoto}
                    setEditorRef={setEditorRef}
                    setEditorRatio={setEditorRatio}
                    replaceFileBtn={replaceFileBtn}
                    removeFileBtn={removeFileBtn}
                    addFloatingImageBtn={addFloatingImageBtn}/>
                </div>
              )
            }
            if (step.type == 'preview') {
              if(index === activeStep && !finalImage){
                if(!hideSelectors){
                  setHideSelectors(true);
                }else{

                  setTimeout(()=>{
                    const uri = editorRef.current.toDataURL({
                      pixelRatio: editorRatio
                    });
                    setFinalImage(uri);
                  }, 500);
                }
              }
              return (
                <div className={classes.centerContent}>
                  <div
                    className={
                      index === activeStep ? classes.visible : classes.hidden
                    }
                  >
                    {finalImage && (
                      <View3d
                        textureUrl={finalImage}
                        modelUrl={product.objUrl}
                        saveFn={() => {}}
                      />
                    )}
                    {!finalImage && (
                      <div className={classes.centerContent}>
                        <CircularProgress />
                      </div>
                    )}
                    <canvas ref={drawingCanvasRef} className={classes.hidden} />
                  </div>
                </div>
              );
            }
            if (step.type == 'share') {
              return (
                <div className={classes.centerContent}>
                  <div
                    className={
                      index == activeStep ? classes.visible : classes.hidden
                    }
                  >
                    <p>share page step</p>
                  </div>
                </div>
              );
            }
          })}

          <Divider />
        </DialogContent>
        <DialogActions>
          <div className={classes.btnContainer}>
            {showAcceptButton() ? (
              <>
                <OtherButton
                  onClick={() => setActiveStep(0)}
                  color='primary'
                  className={classes.m6}
                >
                  {t('Back')}
                </OtherButton>
                <NextButton
                  onClick={() => saveTexture(finalImage)}
                  color='primary'
                  className={classes.m6}
                  disabled={isAcceptUploading()}
                >
                  {isAcceptUploading() ? <CircularProgress /> : t('Accept')}
                </NextButton>
              </>
            ):(
              <>
                <OtherButton
                  onClick={closeFn}
                  color='primary'
                  className={classes.m6}
                >
                  {t('Back')}
                </OtherButton>
                <NextButton
                  onClick={() => setActiveStep(1)}
                  color='primary'
                  className={classes.m6}
                  disabled={isAcceptUploading()}
                >
                  {isAcceptUploading() ? <CircularProgress /> : t('Next')}
                </NextButton>
              </>
            )}
          </div>
        </DialogActions>
      </Dialog>
      <Dialog
        fullWidth={true}
        maxWidth={'md'}
        open={isShareOpen ?? false}
        onClose={handleClose}
      >
        <DialogContent>
          <div
            className={`${classes.centerHorizontal}, ${classes.centerContent}`}
          >
            <img
              src={shareImg}
              alt='Share img'
              style={{ width: '300px', height: '300px' }}
            />
            <div className={classes.newLines}>{t('ShareCTA')}</div>
          </div>
        </DialogContent>
        <DialogActions>
          <div className={classes.btnContainer}>
            {showShareButton && (
              <CopyToClipboard text={shareUrl()}>
                <OtherButton
                  onClick={handleCopy}
                  color='primary'
                  className={classes.m6}
                  disabled={isShareDisabled()}
                >
                  {copied ? t('Copied') : t('Share')}
                </OtherButton>
              </CopyToClipboard>
            )}
            {showNextButton && (
              <NextButton
                onClick={handleNext}
                color='primary'
                className={classes.m6}
              >
                {t('Next step')}
              </NextButton>
            )}
          </div>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Render3dWizard;
