//Core
import React, { useEffect, useState } from 'react';

//Components

//Hooks
import { useTranslation } from 'react-i18next';
import { useOrder } from '../../contexts/OrderContext';
import { usePhotographer } from '../../contexts/PhotographerContext';

//Utils
import OrderService from '../../services/OrderService';

//UI
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
}));

const UPLOAD_INTERVAL_DELAY_MS = 1000;

const UploadManager = (props) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const [sending, setSending] = useState(false);
  const [order, orderDispatch] = useOrder();
  const [orderData, setOrderData] = useState();
  const [photographer] = usePhotographer();
  const orderService = OrderService();

  const getOrderFromStorage = () => {
    return JSON.parse(orderService.getCurrentOrderFromStorage(photographer.photographId));
  };

  const uploadFiles = async () => {
    if (!order.status) return;
    if (order.status === '') return;
    if (order.status === 'SUCCESS') return;
    if (order.status === 'FAILED') return;

    const uploadInProcess = order.orderItems.find(
      (item) => item.status === 'processing'
    );
    if (uploadInProcess) return;

    const itemToUpload = order.orderItems.find(
      (item) => item.status === 'idle'
    );
    if (!itemToUpload) return;

    const orderDataFromStorage2 = getOrderFromStorage();
    const unsavedFiles = orderDataFromStorage2?.unsavedFiles;

    orderDispatch({
      type: 'ORDER_ITEM_SET_STATE_PROCESSING',
      payload: { guid: itemToUpload.guid },
    });
    const service = OrderService();
    await service
      .UploadImage({
        orderId: order?.orderId || orderDataFromStorage2?.orderId,
        orderGuid: order?.orderGuid || orderDataFromStorage2?.orderGuid,
        productId: itemToUpload.productId,
        fileAsBase64: itemToUpload.fileAsBase64,
        fileName: itemToUpload.filePath,
        fileGuid: itemToUpload.guid,
        attributes: itemToUpload.attributes,
      })
      .then(
        (res) => {
          orderDispatch({
            type: 'ORDER_ITEM_SET_STATE_SUCCESS',
            payload: {
              guid: res.data.TrackingGuid,
              url: res.data.ImageUri,
              fileGuid: res.data.ImageGuid,
            },
          });
          setCurrentOrderToStorage({
            guid: res.data.TrackingGuid,
            orderGuid: order.orderGuid,
            status: 'success',
            url: res.data.ImageUri,
            fileGuid: res.data.ImageGuid,
            filePath: orderDataFromStorage2?.filePath,
            unsavedFiles: getNewUnsavedList(res.data.TrackingGuid, unsavedFiles)
          });
        },
        (err) => {
          setCurrentOrderToStorage({
            guid: itemToUpload.guid,
            status: 'failed',
            unsavedFiles
          });
        }
      )
      .catch((err) => {
        setCurrentOrderToStorage({
          guid: itemToUpload.guid,
          status: 'failed',
          unsavedFiles
        });
      });
  };

  const getNewUnsavedList = (guidToRemove, fileList) => {
    const updatedFileList = fileList.filter(item => item.guid !== guidToRemove);
    return updatedFileList;
  };

  const setCurrentOrderToStorage = async (updatedOrderData) => {
    try {
      const orderDataFromStorage = getOrderFromStorage();

      const updatedOrderItems = orderDataFromStorage?.orderItems.map(item => {
        if (item.guid === updatedOrderData.guid) {
          if (updatedOrderData.status === 'processing') {
            item.status = 'processing';
          } else if (updatedOrderData.status === 'success') {
            item.status = 'success';
            item.fileAsBase64 = null;
            item.fileUrl = updatedOrderData.url;
            item.imageGuid = updatedOrderData.fileGuid;
          } else if (updatedOrderData.status === 'failed') {
            item.status = 'failed';
          }
        }
        return item;
      }).filter(item => item.status !== 'failed');
      
      const updatedOrder = { 
        ...orderDataFromStorage, 
        status: 'INITIALIZED', 
        orderItems: updatedOrderItems,
        unsavedFiles: updatedOrderData?.unsavedFiles
      };
      
      orderService.setCurrentOrderToStorage(updatedOrder, photographer.photographId)
      setOrderData(updatedOrder);
    } catch (error) {
      console.error('Error updating order state:', error);
    }
  };

  const tryFinalizeOrder = async () => {
    const orderDataFromStorage = getOrderFromStorage();
    
    if (!orderDataFromStorage) return;
    if (order.status !== 'FINALIZING') return;

    const notDeliveredFiles = order.orderItems.filter(
      (item) => item.status !== 'success'
    );
    if (!notDeliveredFiles) return;
    if (notDeliveredFiles.length > 0) return;

    changeOrderStatus('PROCESSING')
    orderDispatch({ type: 'FINALIZE_REQUESTED' });
    
    orderDataFromStorage?.status === "FINALIZE" && await orderService
      .FinalizeOrder(orderDataFromStorage, photographer)
      .then(
        async (res) => {
          OrderService()
            .CreateOrder(photographer.photographId)
            .then((resp) => {
              orderService.setCurrentOrderToStorage({
                photographerId: photographer.photographId,
                orderId: resp.data.Id,
                orderGuid: resp.data.OrderGuid,
                phone: "",
                email: "",
                firstName: "",
                lastName: "",
                shippingSelected: false,
                status: 'INITIALIZED',
                orderItems: [],
                orderItemsConfig: []
              }, photographer.photographId);
            })
          orderDispatch({ type: 'SUCCESS' });
          orderDispatch({
            type: 'REMOVE_ORDER_ITEMS_FOR_PRODUCT',
            payload: { productId: orderDataFromStorage.orderItems[0].productId },
          });
          await orderService
            .MarkOrderAsDone(orderDataFromStorage)
        },
        (err) => {
          changeOrderStatus('FAILED')
          orderDispatch({ type: 'FAILED' });
        }
      )
      .catch((err) => {
        changeOrderStatus('FAILED')
        orderDispatch({ type: 'FAILED' });
      });
  };

  const changeOrderStatus = (status) => {
    const orderDataFromStorage = getOrderFromStorage();
    const updatedOrder = { ...orderDataFromStorage, status };
    
    orderService.setCurrentOrderToStorage(updatedOrder, photographer.photographId);
    setOrderData(updatedOrder);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      uploadFiles();
      tryFinalizeOrder();
    }, UPLOAD_INTERVAL_DELAY_MS);
    return () => clearInterval(interval);
  });

  return <></>;
};

export default UploadManager;
