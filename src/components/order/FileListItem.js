//Core
import React, { useEffect, useState } from 'react';

//Components

//Hooks
import { useTranslation } from 'react-i18next';
import { useOrder } from '../../contexts/OrderContext';
import { usePhotographer } from '../../contexts/PhotographerContext';
import OrderService from '../../services/OrderService';

//UI
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import CircularProgress from '@material-ui/core/CircularProgress';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import Paper from '@material-ui/core/Paper';
import DoneIcon from '@material-ui/icons/Done';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    marginBottom: '16px',
    height: '65px',
    display: 'flex',
    alignItems: 'center',
  },
  aligner: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  thumbnail: {
    height: '65px',
  },
  fileName: {
    width: '100%',
    flexGrow: 1,
    marginLeft: '8px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    wordWrap: 'break-word',
    [theme.breakpoints.down('sm')]: {
      width: '1px',
    },
  },
  centerVertical: {
    display: 'flex',
    alignItems: 'center',
  },
  success: {
    color: '#28a745',
  },
  failure: {
    color: '#dc3545',
  },
}));

const FileListItem = ({ file, key, hideIncrease, hideQuantity }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const [qty, setQty] = useState(file.qty);
  const [, orderDispatch] = useOrder();

  const [photographer] = usePhotographer();
  const orderService = OrderService();
  const [unsavedImgData, setUnsavedImgData] = useState();

  const handleAddQuantity = () => {
    const orderData = JSON.parse(orderService.getCurrentOrderFromStorage(photographer.photographId));
    const updatedOrderItems = orderData.orderItems.map(item => {
      if (item.guid === file.guid) {
        item.qty++;
      }
      return item;
    });
    orderService.setCurrentOrderToStorage({ ...orderData, orderItems: updatedOrderItems }, photographer.photographId);
  
    setQty(qty + 1);
    orderDispatch({
      type: 'INCREASE_ORDER_ITEM_QTY',
      payload: { guid: file.guid },
    });
  };

  const handleRemoveQuantity = () => {
    const orderData = JSON.parse(orderService.getCurrentOrderFromStorage(photographer.photographId));
    const updatedOrderItems = orderData.orderItems
      .map(item => {
        if (item.guid === file.guid) {
          if (item.qty > 1) {
            item.qty--;
          }
        }
        return item;
      })
      .filter(item => item.qty > 0);
    orderService.setCurrentOrderToStorage({ ...orderData, orderItems: updatedOrderItems }, photographer.photographId);
    
    setQty(qty - 1 >= 1 ? qty - 1 : 1);
    orderDispatch({
      type: 'DECRESE_ORDER_ITEM_QTY',
      payload: { guid: file.guid },
    });
  };

  return (
    <Paper square key={key} className={classes.root}>
      <img
        src={file.fileUrl || unsavedImgData}
        className={classes.thumbnail}
        alt={file.fileName}
      />
      <div className={classes.aligner}>
        <span className={classes.fileName}>{file.fileName}</span>
        <div className={classes.centerVertical}>
          {file.status === 'idle' && <CircularProgress size={18} />}
          {file.status === 'success' && (
            <DoneIcon className={classes.success} />
          )}
          {file.status === 'failed' && (
            <ErrorOutlineIcon className={classes.failure} />
          )}
          <IconButton aria-label='delete' onClick={handleRemoveQuantity}>
            <RemoveCircleOutlineIcon />
          </IconButton>
          {!hideQuantity && <span>{file.qty}</span>}
          {!hideIncrease && (
            <IconButton aria-label='delete' onClick={handleAddQuantity}>
              <AddCircleOutlineIcon />
            </IconButton>
          )}
        </div>
      </div>
    </Paper>
  );
};

export default FileListItem;
