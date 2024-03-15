//Core
import React, { useState, useRef } from 'react';

//Components
import RoundButton from '../core/RoundButton';
import FileListItem from './FileListItem';
import PriceRangeList from './PriceRangeList';
import AttributesList from './AttributesList';

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
import Hidden from '@material-ui/core/Hidden';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
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

const BasicDialogNaturalProduct = ({ product, isOpen, closeFn }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const history = useHistory();

  let fileInput = null;

  const scrollToRef = useRef(null);
  const scrollOptionsRef = useRef(null);

  const [pack, setPack] = useState(1);
  const [order, orderDispatch] = useOrder();
  const [photographer] = usePhotographer();

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

  const handleAddProduct = async() => {
    const attributes = [...new Set(product.attributes.map(a=>a.attributesGroupId))].map(a=> {return{groupId: a, selected: null}});
    const config = order?.orderItemsConfig.find(
      (c) => c.productId === product.id && c.pack === pack
    );
    attributes.forEach(a=> {
      a.selected = config?.configs.find(c=>c.groupId === a.groupId)?.selected ||
        product.attributes.find(pa=>pa.attributesGroupId === a.groupId && pa.position === 1)?.id;
    })
    const fileName = [product.name, ...attributes.map(a=>product.attributes.find(pa=>pa.attributesGroupId === a.groupId && pa.id === a.selected).name)].join(" ");

    const allreadyOrdered = order.orderItems.find((item) => item.fileName === fileName);
    if(!allreadyOrdered){
      const data = await fetch(product.imageUrl);
      const blob = await data.blob();
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onload = () => {
        const orderItem = {
          maxSize: product.size,
          guid: createGuid(),
          fileAsBase64: reader.result,
          fileUrl: product.imageUrl,
          fileName: fileName,
          productId: product.id,
          set: pack,
          qty: 1,
          status: 'idle',
        };
        orderDispatch({ type: 'ADD_ORDER_ITEM', payload: orderItem });
      }
    }else{
      orderDispatch({
        type: 'INCREASE_ORDER_ITEM_QTY',
        payload: { guid: allreadyOrdered.guid },
      });
    }
  };

  const renderAtributes = () => {
    return order.orderItems
      .filter((item) => item.productId === product.id)
      ?.map((item) => <FileListItem key={item.guid} file={item} />);
  };

  const handleRemoveAll = () => {
    orderDispatch({
      type: 'REMOVE_ORDER_ITEMS_FOR_PRODUCT',
      payload: { productId: product.id },
    });
  };

  const isNextDisabled = () => {
    const files = order.orderItems.filter(
      (item) => item.productId === product.id
    );
    return files.length == 0;
  };

  const handleNext = () => {
    closeFn();
    history.push(`/photographer/${product.photographerId}/checkout`);
  };

  const calculatePrice = () => {
    const quantity = order.orderItems
      .filter((item) => item.productId === product.id)
      .reduce((sum, item) => sum + item.qty, 0);
    return getLabelPrice(product.id, quantity, photographer, order);
  };

  const attributesAvailable = () => {
    if (!product) return false;
    if (!product.attributes) return false;

    return product.attributes.length > 0;
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
                <RoundButton onClick={() => handleAddProduct()}>
                  <Box className={classes.centerContent}>
                    <AddPhotoAlternateIcon />
                    <span>{t('Add product')}</span>
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
          {renderAtributes()}
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
              disabled={isNextDisabled()}
            >
              {t('Next step')} <ShoppingCartIcon fontSize='small' />
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

export default BasicDialogNaturalProduct;
