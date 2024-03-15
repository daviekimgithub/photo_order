//Core
import React, { useState, useEffect, useRef } from 'react';

//Components
import RoundButton from '../core/RoundButton';
import FileListItem from './FileListItem';
import PriceRangeList from './PriceRangeList';
import AttributesList from './AttributesList';
import Render3dDialog from './Render3dDialog';
import Render3dWizard from './Render3dWizard/Render3dWizard';

//Hooks
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useOrder } from '../../contexts/OrderContext';
import { usePhotographer } from '../../contexts/PhotographerContext';

//Utils
import { createGuid } from '../../core/helpers/guidHelper';
import { formatPrice, getLabelPrice } from '../../core/helpers/priceHelper';

//UI
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Hidden from '@material-ui/core/Hidden';
import Grid from '@material-ui/core/Grid';
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';
import Typography from '@material-ui/core/Typography';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import Divider from '@material-ui/core/Divider';

const placeholderImg = 'https://via.placeholder.com/400?text=No%20image';

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

const OptionsButton = withStyles((theme) => ({
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

const RemoveButton = withStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: '400px',
    color: '#dc3545',
    borderRadius: '50px',
    padding: '12px 28px',
    border: '1px solid #dc3545',
    '&:hover': {
      color: 'white',
      backgroundColor: '#dc3545',
    },
  },
}))(Button);

const Basic3dDialog = ({ product, isOpen, closeFn }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const history = useHistory();

  let fileInput = null;
  const scrollToRef = useRef(null);
  const scrollOptionsRef = useRef(null);

  const [pack, setPack] = useState(1);
  const [open3d, setOpen3d] = useState(false);
  const [order, orderDispatch] = useOrder();
  const [photographer] = usePhotographer();

  const getMaxFileLimit = () => {
    const max = product?.sizes?.length ?? 1;
    return max;
  };

  const getUploadedFilesCount = () => {
    if (!order || order.orderItems?.length === 0) return 0;

    const uploadedFiles = order.orderItems.filter(
      (i) => i.productId === product.id
    );
    return uploadedFiles?.length ?? 0;
  };

  const disableUploadButton = () => {
    const limit = getMaxFileLimit();
    const current = getUploadedFilesCount();

    return current >= limit;
  };

  const executeScroll = () =>
    scrollToRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    });
  const executeOptionsScroll = () =>
    scrollOptionsRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    });
  const fileInputHandler = (event) => {
    const limit = getMaxFileLimit();
    const actual = getUploadedFilesCount();

    if (limit <= actual) return;

    const { files } = event.target;
    for (let i = 0; i < files.length; i++) {
      if (actual + 1 + i > limit) return;
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

          orderDispatch({ type: 'ADD_ORDER_ITEM', payload: orderItem });
          executeScroll();
        };
      };
    }
  };

  const handleUploadClick = () => {
    fileInput.click();
  };

  const renderFiles = () => {
    return order.orderItems
      .filter(
        (item) => item.productId === product.id && item.isLayerItem === true
      )
      ?.map((item) => (
        <FileListItem
          key={item.guid}
          file={item}
          hideQuantity={true}
          hideIncrease={true}
        />
      ));
  };

  const handleRemoveAll = () => {
    orderDispatch({
      type: 'REMOVE_ORDER_ITEMS_FOR_PRODUCT',
      payload: { productId: product.id },
    });
  };

  const isNextDisabled = () => {
    const files = order.orderItems.filter(
      (item) =>
        item.productId === product.id &&
        item.isLayerItem === true &&
        item.status === 'success'
    );

    const limit = getMaxFileLimit();

    return files.length !== limit;
  };

  const calculatePrice = () => {
    // const quantity = order.orderItems
    //   .filter((item) => item.productId === product.id)
    //   .reduce((sum, item) => sum + item.qty, 0);
    return getLabelPrice(product.id, 1, photographer, order);
  };

  const attributesAvailable = () => {
    if (!product) return false;
    if (!product.attributes) return false;

    return product.attributes.length > 0;
  };

  function isUploadingFiles() {
    const { orderItems } = order;

    const items = orderItems.filter(
      (i) => i.productId == product.id && i.status != 'success'
    );

    if (!items || items.length == 0) return false;

    return true;
  }

  return (
    <>
      <Dialog
        key={`3d_${product.id}`}
        fullWidth={true}
        maxWidth={'md'}
        open={isOpen ?? false}
        onClose={closeFn}
      >
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            <Grid container spacing={3} className={classes.mb24}>
              <Grid item xs={12} md={6}>
                <Container>
                  <img
                    src={product.imageUrl ?? placeholderImg}
                    alt=''
                    style={{ width: '100%', maxHeight: '800px' }}
                  />
                </Container>
                <Box className={classes.centerContent}>
                  {t('filesLimit', { limit: getMaxFileLimit() })}
                </Box>
                <Box className={classes.centerContent}>
                  <input
                    type='file'
                    style={{ display: 'none' }}
                    inputprops={{ accept: 'image/*' }}
                    multiple
                    onChange={fileInputHandler}
                    ref={(input) => {
                      fileInput = input;
                    }}
                  />
                  <RoundButton
                    onClick={() => handleUploadClick()}
                    disabled={disableUploadButton()}
                  >
                    <Box className={classes.centerContent}>
                      <AddPhotoAlternateIcon />
                      <span>{t('Pick files')}</span>
                    </Box>
                  </RoundButton>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box className={classes.spaceBetweenContent}>
                  <Box>
                    <Typography variant='h6' className={classes.title}>
                      {product.name}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant='h6' className={classes.title}>
                      {formatPrice(calculatePrice())} €
                    </Typography>
                  </Box>
                </Box>
                <Typography variant='body2' className={classes.description}>
                  {product.description}
                </Typography>
                <PriceRangeList
                  product={product}
                  photographer={photographer}
                  order={order}
                />
                <div ref={scrollOptionsRef} />
                <AttributesList product={product} pack={pack} />
              </Grid>
            </Grid>
            <div ref={scrollToRef} />
            {renderFiles()}
          </DialogContentText>
          <Divider />
        </DialogContent>
        <DialogActions>
          <Grid
            container
            spacing={0}
            direction='row'
            justifyContent='space-between'
          >
            <Grid
              item
              xs={6}
              md={4}
              className={`${classes.centerContent} ${classes.p6}`}
            >
              <RemoveButton onClick={handleRemoveAll} color='primary'>
                {t('REMOVE ALL')}
              </RemoveButton>
            </Grid>
            <Grid
              item
              xs={6}
              md={4}
              className={`${classes.centerContent} ${classes.p6}`}
            >
              <NextButton
                onClick={() => setOpen3d(true)}
                color='primary'
                disabled={isNextDisabled()}
              >
                {isUploadingFiles() ? (
                  <CircularProgress size={18} />
                ) : (
                  t('Next step')
                )}
              </NextButton>
            </Grid>
            <Hidden mdUp>
              {attributesAvailable() && (
                <Grid
                  item
                  xs={6}
                  className={`${classes.centerContent} ${classes.p6}`}
                >
                  <OptionsButton onClick={executeOptionsScroll} color='primary'>
                    {t('OPTIONS')}
                  </OptionsButton>
                </Grid>
              )}
            </Hidden>
          </Grid>
        </DialogActions>
      </Dialog>
      <Render3dWizard
        key={`3d_pr_dialog_${product.id}`}
        isOpen={open3d}
        closeFn={() => setOpen3d(false)}
        product={product}
        pack={pack}
      />
    </>
  );
};

export default Basic3dDialog;
