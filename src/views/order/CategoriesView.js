//Core
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

//Components
import CategoryCard from '../../components/order/CategoryCard';
import CategoryCardSkeleton from '../../components/order/CategoryCardSkeleton';
import BanerSlider from '../../components/order/BanerSlider';
import UncategorizedCard from '../../components/order/UncategorizedCard';

//Hooks
import { useTranslation } from 'react-i18next';
import { usePhotographer } from '../../contexts/PhotographerContext';
import { useGetProducts } from '../../services/OrderUtils';
import { useOrder } from '../../contexts/OrderContext';

//Utils
import OrderService from '../../services/OrderService';
import DatabaseService from '../../services/TokenService';
import { createGuid } from '../../core/helpers/guidHelper';

//UI
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    paddingLeft: '60px',
    paddingRight: '60px',
    paddingTop: '8px',
    paddingBottom: '8px'
  },
  grid: {
    flexGrow: 1,
  },
}));

function RenderSkeletonList() {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <CategoryCardSkeleton key={1} />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <CategoryCardSkeleton key={2} />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <CategoryCardSkeleton key={3} />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <CategoryCardSkeleton key={4} />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <CategoryCardSkeleton key={5} />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <CategoryCardSkeleton key={6} />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <CategoryCardSkeleton key={7} />
      </Grid>
    </Grid>
  );
}

const CategoriesView = (props) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const history = useHistory(); 

  const [photographer, dispatch] = usePhotographer();
  const productsQuery = useGetProducts(photographer?.photographId ?? 0);
  const orderService = OrderService();
  const [order, orderDispatch] = useOrder();

  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({
    modalTitle: "",
    modalButtonText: "",
    modalButtonPath: ""
  });

  useEffect(() => {
    async function initOrder() {
      let unsavedImages = [];
      
      try {
        unsavedImages = await DatabaseService.getUnsavedImages();
      } catch (error) {
        console.error('Error getting unsaved images:', error);
      }

      const isUnsavedImagesUploaded = localStorage.getItem("isUnsavedImagesUploaded");

      const isHaveUnsavedImages = 
        unsavedImages && 
        unsavedImages?.length > 0 && 
        !isUnsavedImagesUploaded

      const orderDataFromStorage = JSON.parse(orderService.getCurrentOrderFromStorage(photographer.photographId));

      const isHasOrderItems = orderDataFromStorage?.orderItems?.length > 0;
      const isUnsavedFilesExists = orderDataFromStorage?.orderItems?.every(item => item.status === "success");
      
      if (isHaveUnsavedImages) { 
        setShowModal(true);

        setModalContent({
          modalTitle: 'Your last order was not finish, please open "Last Orders" tab and reload orders',
          modalButtonText: "Go to the order details",
          modalButtonPath: "last-orders"
        })

        const preparedUnsavedImages = unsavedImages.map(item => {
          return {
            filePath: item.ImagePath,
            categoryId: item.categoryId,
            productId: item.ProductId,
            guid: createGuid() 
          }
        }) 

        OrderService()
          .setLocalStorageOrder(
            photographer.photographId, 
            {
              FirstName: "",
              LastName: "",
              Phone: "",
              Email: "",
              StreetAddress: "",
              City: "",
              Country: "",
              ZipCode: "",
              IsShippingChoosen: false,
              OrderGuid: orderDataFromStorage.orderGuid,
              OrderItems: preparedUnsavedImages,
              PaymentMethod: orderDataFromStorage.paymentMethod,
              Status: 'Unsent',
              UnsavedFiles: []
            }
          )
        
        OrderService().removeOrderFromLocalStorage(photographer.photographId)

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
                shippingSelected: resp.data.IsShippingChoosen,
                status: 'INITIALIZED',
                unsavedFiles: [],
                orderItems: [],
                orderItemsConfig: []
              }, photographer.photographId)
              orderDispatch({
                type: 'CREATE',
                payload: {
                  PhotographerId: photographer.photographId,
                  OrderId: resp.data.Id,
                  OrderGuid: resp.data.OrderGuid,
                  Phone: resp.data.Phone,
                  Email: resp.data.Email,
                  FirstName: resp.data.FirstName,
                  LastName: resp.data.LastName,
                  IsShippingChoosen: resp.data.IsShippingChoosen,
                },
              });
            })

        localStorage.setItem("isUnsavedImagesUploaded", "true");
      } else if (isHasOrderItems) {
        setShowModal(true);
        if (!isUnsavedFilesExists) {
          setModalContent({
            modalTitle: 'Your last order was not finish, please open "Last Orders" tab and reload orders',
            modalButtonText: "Go to the order details",
            modalButtonPath: "last-orders"
          })
  
          OrderService()
            .setLocalStorageOrder(
              photographer.photographId, 
              {
                FirstName: orderDataFromStorage?.firstName || "",
                LastName: orderDataFromStorage?.lastName || "",
                Phone: orderDataFromStorage?.phone || "",
                Email: orderDataFromStorage?.email || "",
                StreetAddress: orderDataFromStorage?.shippingStreet || "",
                City: orderDataFromStorage?.shippingCity || "",
                Country: orderDataFromStorage?.shippingCountry || "",
                ZipCode: orderDataFromStorage?.shippingZip || "",
                IsShippingChoosen: orderDataFromStorage.shippingSelected || false,
                OrderGuid: orderDataFromStorage.orderGuid,
                OrderItems: orderDataFromStorage.orderItems,
                PaymentMethod: orderDataFromStorage.paymentMethod,
                Status: 'Unsent',
                UnsavedFiles: orderDataFromStorage?.unsavedFiles
              }
            )
          
          OrderService().removeOrderFromLocalStorage(photographer.photographId)
          
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
                shippingSelected: resp.data.IsShippingChoosen,
                status: 'INITIALIZED',
                unsavedFiles: [],
                orderItems: [],
                orderItemsConfig: []
              }, photographer.photographId)
              orderDispatch({
                type: 'CREATE',
                payload: {
                  PhotographerId: photographer.photographId,
                  OrderId: resp.data.Id,
                  OrderGuid: resp.data.OrderGuid,
                  Phone: resp.data.Phone,
                  Email: resp.data.Email,
                  FirstName: resp.data.FirstName,
                  LastName: resp.data.LastName,
                  IsShippingChoosen: resp.data.IsShippingChoosen,
                },
              });
            })
        } else {
          const { productId, categoryId } = orderDataFromStorage?.orderItems?.[0]
          setModalContent({
            modalTitle: 'You have photos ready to send',
            modalButtonText: "Ok",
            modalButtonPath: ""
          })
        }
      }
    }

    initOrder();
  }, []);

  function showOtherCategory(photographer) {
    let productsList = photographer?.products ?? [];
    productsList = productsList.filter((p) => {
      if (p.categories?.length === 0 && p.isAutoGenerated === 0) return true;
      else return false;
    });
    return productsList > 0;
  }

  const renderCategories = () => {
    return (
      <Grid container spacing={3}>
        {photographer.productCategories.map((category) => (
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={category.Id}>
            <CategoryCard key={category.Id} category={category} />
          </Grid>
        ))}
        {showOtherCategory(photographer) && (
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key='uncategorized'>
            <UncategorizedCard />
          </Grid>
        )}
      </Grid>
    );
  };

  const isLoading = () => {
    if (
      photographer.productCategories &&
      photographer.productCategories.length > 0
    )
      return false;

    return true;
  };

  const { data } = productsQuery;
  useEffect(() => {
    if (data) {
      dispatch({ type: 'ADD_PRODUCTS', data: data });
    }
  }, [data, dispatch]);

  return (
    <div className={classes.root}>
      <BanerSlider photographerId={photographer.photographId} />
      <Dialog open={showModal} onClose={() => setShowModal(false)}>
        <DialogTitle>{modalContent.modalTitle}</DialogTitle>
        <DialogActions style={{ justifyContent: "center"}}>
          <Button onClick={() => {
            setShowModal(false)
            if (modalContent.modalButtonPath) {
              history.push(`/photographer/${photographer.photographId}/${modalContent.modalButtonPath}`);
            }
          }}>
            {modalContent.modalButtonText}
          </Button>
        </DialogActions>
      </Dialog>
      {isLoading() && RenderSkeletonList()}
      {!isLoading() && renderCategories()}
    </div>
  );
};

export default CategoriesView;
