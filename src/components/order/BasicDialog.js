//Core
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { FilePicker } from '@capawesome/capacitor-file-picker';

//Components
import RoundButton from './../core/RoundButton';
import FileListItem from './FileListItem';
import PriceRangeList from './PriceRangeList';
import AttributesList from './AttributesList';

//Hooks
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import { useOrder } from '../../contexts/OrderContext';
import { usePhotographer } from '../../contexts/PhotographerContext';

//Utils
import { createGuid } from '../../core/helpers/guidHelper';
import { formatPrice, getLabelPrice } from '../../core/helpers/priceHelper';
import { getCompressedImage } from '../../core/helpers/uploadImageHelper';
import OrderService from '../../services/OrderService';
import DatabaseService from '../../services/TokenService';

//UI
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Hidden from '@material-ui/core/Hidden';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import Typography from '@material-ui/core/Typography';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import Divider from '@material-ui/core/Divider';
import CircularProgress from '@material-ui/core/CircularProgress';

const placeholderImg = 'https://via.placeholder.com/400?text=No%20image';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  actionButtons: {
    justifyContent: 'center',
    alignItems: 'center',
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

const getProductCategory = (url) => {
  const urlPaths = url.split('/');
  return urlPaths[urlPaths.length - 2]
}

const BasicDialog = ({ product, isOpen, closeFn }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const history = useHistory();
  const location = useLocation();

  const scrollToRef = useRef(null);
  const scrollOptionsRef = useRef(null);

  const [pack, setPack] = useState(1);
  const [order, orderDispatch] = useOrder();
  const [photographer] = usePhotographer();
  const orderService = OrderService();
  const [orderData, setOrderData] = useState();
  const [isReadyReupload, setIsReadyReupload] = useState(false);
  const [itemsToReupload, setItemsToReupload] = useState([]);

  const orderDataFromStorage = JSON.parse(orderService.getCurrentOrderFromStorage(photographer.photographId));

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

  const fileInputHandler = useCallback(async () => {
    const result = await FilePicker.pickImages({
      multiple: true,
      readData: true
    });
    JSON.stringify(result, null, 3)
    const filesArray = Array.from(result.files);
    const updatedOrderData = { ...orderDataFromStorage };
    const updatedUnsavedFiles = [];
    
    for (const file of filesArray) {
      try {
        const trackingGuid = createGuid();
        
        const base64Data = file.data;
        
        const compressedFile = await getCompressedImage({
          width: file.width,
          height: file.height,
          maxSize: product.size,
          file: { data: base64Data, name: file.name }
        });

        const orderItem = {
          maxSize: product.size,
          guid: trackingGuid,
          fileAsBase64: null,
          fileUrl: URL.createObjectURL(compressedFile.file),
          fileName: compressedFile.file.name,
          productId: product.id,
          filePath: file.path,
          categoryId: getProductCategory(location.pathname),
          set: pack,
          qty: 1,
          status: 'idle',
        };

        if (!updatedOrderData?.orderItems) {
          updatedOrderData.orderItems = [];
        }
        updatedOrderData?.orderItems.push(orderItem);
        updatedUnsavedFiles.push({ filePath: file.path, guid: trackingGuid });

        orderDispatch({ type: 'ADD_ORDER_ITEM', payload: {...orderItem, fileAsBase64: compressedFile.fileAsBase64 } });
        executeScroll();
      } catch (error) {
        console.error(`Error processing file ${file.name}:`, error);
      }
    }

    orderService.setCurrentOrderToStorage(
      { 
        ...updatedOrderData, 
        unsavedFiles: updatedUnsavedFiles
      },
      photographer.photographId
    );
  }, [product, pack, orderDispatch, executeScroll]);

  const isAllImagesDone = () => {
    return order?.orderItems.every(item => item.status === "success");
  };

  useEffect(() => {
    const reuploadData = async () => {
      const orderDataFromStorage = JSON.parse(orderService.getCurrentOrderFromStorage(photographer.photographId));
      const isThereAnyUnsavedFiles = orderDataFromStorage?.unsavedFiles?.length;
  
      if (isThereAnyUnsavedFiles) {
        setIsReadyReupload(true);
        setItemsToReupload(orderDataFromStorage?.unsavedFiles);
      }
      
      if (orderDataFromStorage?.readyToReupload) {
        await handleReupload(orderDataFromStorage?.unsavedFiles);
      }
    }

    reuploadData();
  }, [orderDataFromStorage?.id])

  useEffect(() => {
    if (orderDataFromStorage?.orderItems?.length > 0 && orderDataFromStorage?.orderItems?.length !== order?.orderItems?.length) {
      const successsOrderData = orderDataFromStorage?.orderItems 
        ? orderDataFromStorage?.orderItems?.filter(item => item.status === 'success')
        : orderDataFromStorage

      orderDispatch({ type: 'ADD_ORDER_ITEMS_AT_END', payload: successsOrderData });
    }
  }, [orderDataFromStorage?.orderItems?.length]);

  const renderFiles = () => {
    return order?.orderItems
      .filter((item) => item.productId === product.id)
      .map((item) => <FileListItem key={item.guid} file={item} />)
  };

  const handleRemoveAll = () => {
    const orderDataFromStorage = JSON.parse(orderService.getCurrentOrderFromStorage(photographer.photographId));
    const updatedOrderData = { ...orderDataFromStorage, orderItems: [], unsavedFiles: [] };
    
    orderService.setCurrentOrderToStorage(updatedOrderData, photographer.photographId);

    localStorage.setItem("isUnsavedImagesUploaded", "true");

    orderDispatch({
      type: 'REMOVE_ORDER_ITEMS_FOR_PRODUCT',
      payload: { productId: product.id },
    });
  };

  const isNextDisabled = () => {
    const files = order?.orderItems.filter((item) => item.productId === product.id);
    return files.length === 0;
  };  

  const handleNext = () => {
    closeFn();
    history.push(`/photographer/${product.photographerId}/checkout`);
  };

  const calculatePrice = () => {
    const quantity = order?.orderItems
      .filter((item) => item.productId === product.id)
      .reduce((sum, item) => sum + item.qty, 0);
    return getLabelPrice(product.id, quantity, photographer, order);
  };

  const attributesAvailable = () => {
    if (!product) return false;
    if (!product.attributes) return false;

    return product.attributes.length > 0;
  };

  const handleReupload = async (reuploadItems) => {
    const filesToReupload = reuploadItems.filter(item => item.productId === product.id)

    for (const itemObj of filesToReupload) {
      try {
        let imgObj = {};

        imgObj = itemObj.filePath.startsWith("content://media")
          ? await DatabaseService.readImageContent(itemObj.filePath)
          : await DatabaseService.getLastOrderImageFromDevice(itemObj.filePath)
        
        const orderItem = {
          maxSize: product.size,
          guid: createGuid(),
          fileAsBase64: imgObj.data,
          fileUrl: null,
          filePath: itemObj.filePath,
          fileName: createGuid(),
          categoryId: getProductCategory(location.pathname),
          productId: product.id,
          set: pack,
          qty: 1,
          status: 'idle',
        };
        
        const updatedOrderData = { ...orderDataFromStorage, unsavedFiles: [] };
        updatedOrderData?.orderItems.push(orderItem);
        orderService.setCurrentOrderToStorage(updatedOrderData, photographer.photographId);
        
        orderDispatch({ type: 'ADD_ORDER_ITEM', payload: { ...orderItem, fileAsBase64: imgObj.data } });
      } catch (error) {
        console.error('Error fetching image:', error);
      }
    }

    setIsReadyReupload(false);
  };

  return (
    <Dialog
      key={product.id}
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
                <RoundButton onClick={fileInputHandler}>
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
              onClick={handleNext}
              color='primary'
              disabled={isNextDisabled() || !isAllImagesDone()}
            >
              {!isAllImagesDone() ? (
                <CircularProgress size={22} />
              ) : (
                <>
                  {t('Next step')} <ShoppingCartIcon fontSize='small' />
                </>
              )}
            </NextButton>
          </Grid>
          <Hidden mdUp>
            {attributesAvailable() && (
              <Grid
                item
                xs={12}
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
  );
};

export default BasicDialog;
