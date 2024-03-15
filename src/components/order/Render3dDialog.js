//Core
import React, { useState, useEffect } from 'react';

//Components
import Presenter3d from './Presenter3d';

//Hooks
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useOrder } from '../../contexts/OrderContext';

//Utils
import { CopyToClipboard } from 'react-copy-to-clipboard';

//UI
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Divider from '@material-ui/core/Divider';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  fillWidth: {
    width: '100%',
  },
  p6: {
    padding: '6px',
  },
  m6: {
    margin: '6px',
  },
  centerContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  spaceBetweenContent: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  title: {
    color: '#3A3A3A',
    fontWeight: 600,
    marginBottom: '20px',
  },
  description: {
    marginBottom: '20px',
  },
  mb24: {
    marginBottom: '24px',
  },
  btnContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
  },
}));

const NextButton = withStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: '400px',
    color: 'white',
    borderRadius: '50px',
    padding: '12px 28px',
    backgroundColor: '#28a745',
    '&:hover': {
      backgroundColor: '#218838',
    },
  },
}))(Button);

const OtherButton = withStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: '400px',
    color: '#28a745',
    borderRadius: '50px',
    padding: '12px 28px',
    border: '1px solid #28a745',
    '&:hover': {
      color: 'white',
      backgroundColor: '#28a745',
    },
  },
}))(Button);

const Render3dDialog = ({ product, isOpen, closeFn, pack }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const history = useHistory();
  const [order] = useOrder();
  const [copied, setCopied] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  const handleNext = () => {
    closeFn();
    history.push(`/photographer/${product.photographerId}/checkout`);
  };

  const cacheImages = async (srcArray) => {
    const promises = await srcArray.map((src) => {
      return new Promise(function (resolve, reject) {
        const img = new Image();
        img.src = src;
        img.onload = resolve();
        img.onerror = reject();
      });
    });

    await Promise.all(promises);

    setIsLoading(false);
  };

  useEffect(() => {
    const layerImg = product.layerImageUrl;
    const objUrl = product.objUrl;
    const imgs = [layerImg, objUrl];

    cacheImages(imgs);
  }, [product.layerImageUrl, product.objUrl]);

  function getOrderItem(items) {
    if (!items || items.length == 0) return null;

    const result = items.find(
      (i) =>
        i.productId == product.id && !i.isLayerItem && i.status == 'success'
    );

    return result;
  }

  function isShareDisabled() {
    if (!order) return true;

    const { orderItems } = order;

    const item = getOrderItem(orderItems);
    if (!item) return true;

    return false;
  }

  function handleCopy() {
    setCopied(true);
  }

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

  return (
    <Dialog
      fullWidth={true}
      maxWidth={'lg'}
      open={isOpen ?? false}
      onClose={closeFn}
      scroll='body'
    >
      <DialogContent>
        {isLoading ? (
          <div className={classes.centerContent}>
            <CircularProgress />
          </div>
        ) : (
          <div className={classes.centerContent}>
            <Presenter3d product={product} pack={pack} />
          </div>
        )}
        <Divider />
      </DialogContent>
      <DialogActions>
        <div className={classes.btnContainer}>
          <OtherButton onClick={closeFn} color='primary' className={classes.m6}>
            {t('Back')}
          </OtherButton>
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
          <NextButton
            onClick={handleNext}
            color='primary'
            className={classes.m6}
          >
            {t('Next step')}
          </NextButton>
        </div>
      </DialogActions>
    </Dialog>
  );
};

export default Render3dDialog;
