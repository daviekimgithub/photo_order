import React, { useContext, useEffect, useState, useMemo  } from 'react';
import { Button, Card, Container, Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import OrderService from '../../services/OrderService';
import { useOrder } from '../../contexts/OrderContext';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import RefreshIcon from '@material-ui/icons/Autorenew';
import DatabaseService from '../../services/TokenService';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import styled from 'styled-components';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '8px',
    width: '100%',
  },
  orderCard: {
    position: 'relative',
    padding: '4rem',
    marginBottom: '1rem',
  },
  orderNum: {
    position: 'absolute',
    top: '1rem',
    left: '1rem',
    fontWeight: 'bold'
  },
  orderStatus: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    fontWeight: 'bold',
  },
  orderLabel: {
    fontWeight: 'bold'
  },
  orderImg: {
    maxWidth: '150px'
  },
  orderImagesContainer: {
    display: 'none',
    marginTop: '1rem',
  },
  orderImagesVisible: {
    display: 'block',
  },
  orderImagesWrap: {
    display: 'flex',
    paddingTop: '2rem',
  },
  orderImgBtn: {
    border: "1px solid #4556ac",
    width: 'fit-content',
    padding: '0.5rem',
    marginLeft: '1rem',
  },
  imgWrap: {
    padding: '2rem',
  },
  noOrders: {
    color: '#fff',
    zIndex: 2,
    margin: '3rem',
  },
  notFound: {
    textAlign: 'center',
  },
  welcomeBackground: {
    position: 'absolute',
    left: '0',
    top: '0',
    height: '100%',
    width: '100%',
    backgroundColor: "#5F9EA0"
  },
  reopenButton: {
    border: '1px solid #3f51b5',
    position: 'absolute',
    marginTop: '0.5rem'
  }
}));

const orderStatus = {
  Sent: "Sent",
  Unsent: "Unsent",
  ReadyToSent: "Ready to sent"
}

const S = {
  View: styled.div`
    height: 100%;
    position: relative;
    min-height: 85vh;
    padding: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
  `,
};

const LastOrdersView = () => {
  const classes = useStyles();
  const { authUser: { id } } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentOrder, setCurrentOrder] = useState();

  const history = useHistory();

  const orderService = OrderService();
  const [order, orderDispatch] = useOrder();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await orderService.getAllLocalStorageOrders(id)
        const transformedData = data.map(item => ({
          ...JSON.parse(item.value || ''),
          expanded: false,
        }));
        setOrders(transformedData);
      } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
      }
    };
    
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (orders.length) {
        try {
          const updatedOrders = await Promise.all(
            orders.map(async (order) => {
              const imageUrlsPromises = order.OrderItems.map(async (item) => {
                try {
                  const imageUrl = await DatabaseService.getLastOrderImageFromDevice(item.FilePath);
                  
                  return imageUrl.data;
                } catch (error) {
                  console.error(`Error fetching image for item ${item.FilePath}:`, error);
                  return null;
                }
              });
      
              const imageUrls = (await Promise.all(imageUrlsPromises)).filter(url => url !== null);
                
              return { ...order, imageUrls };
            })
          );
          setOrders(updatedOrders);
        } catch (err) {
          console.error('Error fetching images:', err);
          throw err;
        }
      }
    };    
  
    fetchData();
  }, [orders.length]);  

  const toggleImages = (index) => {
    setOrders((prevOrders) => {
      const updatedOrders = [...prevOrders];
      updatedOrders[index].expanded = !updatedOrders[index].expanded;
      return updatedOrders;
    });
  };

  const getOrderTime = (timestamp) => {
    const date = new Date(parseInt(timestamp, 10));

    const month = date.toLocaleString('default', { month: 'short' });
    const day = date.getDate();
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    const formattedTime = `${day}${month}, ${year}, ${hours}:${minutes}:${seconds}`;
    
    return formattedTime;
  };

  const handleReopenOrder = (order) => {
    const orderDataFromStorage = JSON.parse(orderService.getCurrentOrderFromStorage(id));
    const isOrderAlreadyHas = orderDataFromStorage?.orderItems?.length > 0;
    
    if (isOrderAlreadyHas) {
      setCurrentOrder(order)
      setShowModal(true);
    } else {
      handleTransferDataToOrder(order)
    }
  }

  const handleModalButton = () => {
    handleTransferDataToOrder(currentOrder);
    setCurrentOrder(null)
  }

  const handleTransferDataToOrder = (order) => {
    const { categoryId } = order?.OrderItems?.[0];

    const preparedUnsavedFiles = order?.OrderItems.map(orderData => {
      return {
        filePath: orderData.filePath,
        guid: orderData.guid,
        productId: orderData.productId
      }
    });

    orderService.removeOrderFromLocalStorage(`${id}`)

    OrderService()
      .CreateOrder(id)
      .then((resp) => {
        orderService.setCurrentOrderToStorage({
          id,
          orderId: resp.data.Id,
          orderGuid: resp.data.OrderGuid,
          phone: order?.Phone || "",
          email: order?.Email || "",
          firstName: order?.FirstName || "",
          lastName: order?.LastName || "",
          shippingSelected: resp.data.IsShippingChoosen,
          status: 'INITIALIZED',
          unsavedFiles: preparedUnsavedFiles,
          orderItems: [],
          orderItemsConfig: [],
          readyToReupload: true
        }, id)
      })
  
    orderService.removeOrderFromLocalStorage(`${id}_${order.currentTime}`)
    history.push(`/photographer/${id}/categories/${categoryId}`)
  } 
  
  return (
    <S.View>
      <div className={classes.welcomeBackground} />
      <Container maxWidth="md">
        <Dialog open={showModal} onClose={() => setShowModal(false)}>
          <DialogTitle>You already have an unfinished order. If you continue, the data associated with it will be deleted</DialogTitle>
          <DialogActions style={{ justifyContent: "center"}}>
            <Button onClick={handleModalButton}>
              Continue
            </Button>
          </DialogActions>
        </Dialog>
        <Grid container spacing={3} direction="column">
          {orders.length ? orders.map((order, key) => (
            <Grid item key={key}>
              <Card className={classes.orderCard}>
                <Typography 
                  variant="h6" 
                  gutterBottom 
                  className={classes.orderNum}
                >
                  №{key + 1}
                </Typography>
                
                <Typography 
                  variant="h6" 
                  gutterBottom 
                  className={classes.orderStatus}
                  style={ 
                    order.Status === orderStatus.Sent 
                      ? { color: 'green' } 
                      : order.Status === orderStatus.Unsent 
                        ? { color: 'red' } 
                        : {} 
                  }  
                >
                  {orderStatus[order.Status]}
                </Typography>
                <Typography variant="h6" gutterBottom>
                  <span className={classes.orderLabel}>First Name:</span> {
                    order.FirstName
                      ? order.FirstName
                      : 'Not specified'
                  }
                </Typography>
                <Typography variant="h6" gutterBottom>
                  <span className={classes.orderLabel}>Last Name:</span> {
                    order.LastName
                      ? order.LastName
                      : 'Not specified'
                  }
                </Typography>
                <Typography variant="h6" gutterBottom>
                  <span className={classes.orderLabel}>Phone:</span> {
                    order.Phone
                      ? order.Phone
                      : 'Not specified'
                  }
                </Typography>
                <Typography variant="h6" gutterBottom>
                  <span className={classes.orderLabel}>Email:</span> {
                    order.Email
                      ? order.Email
                      : 'Not specified'
                  }
                </Typography>
                <Typography variant="h6" gutterBottom>
                  <span className={classes.orderLabel}>Street Address:</span> {
                    order.StreetAddress 
                      ? order.StreetAddress
                      : 'Not specified'
                  }
                </Typography>
                <Typography variant="h6" gutterBottom>
                  <span className={classes.orderLabel}>Zip Code:</span> {
                    order.ZipCode 
                      ? order.ZipCode
                      : 'Not specified'
                  }
                </Typography>
                <Typography variant="h6" gutterBottom>
                  <span className={classes.orderLabel}>City:</span> {
                    order.City 
                      ? order.City
                      : 'Not specified'
                  }
                </Typography>
                <Typography variant="h6" gutterBottom>
                  <span className={classes.orderLabel}>Country:</span> {
                    order.Country 
                      ? order.Country
                      : 'Not specified'
                  }
                </Typography>
                <Typography variant="h6" gutterBottom>
                  <span className={classes.orderLabel}>Order Id:</span> {order.OrderGuid}
                </Typography>
                <Typography variant="h6" gutterBottom>
                  <span className={classes.orderLabel}>Payment Method:</span> {
                    order.PaymentMethod 
                      ? order.PaymentMethod
                      : 'Not specified'
                  }
                </Typography>
                <Typography variant="h6" gutterBottom>
                  <span className={classes.orderLabel}>Order Time:</span> {getOrderTime(order.currentTime)}
                </Typography>

                {order.Status !== orderStatus.Unsent ? (
                  <>
                    <div className={classes.orderImagesWrap}>
                      <Typography variant="h5" gutterBottom>Order Images:</Typography>
                      <Button onClick={() => toggleImages(key)} className={classes.orderImgBtn}>
                        {order.expanded ? <RemoveIcon /> : <AddIcon />}
                      </Button>
                    </div>
                    <div
                      className={`${classes.orderImagesContainer} ${
                        order.expanded ? classes.orderImagesVisible : ''
                      }`}
                    >
                      {order.imageUrls && order.imageUrls.length > 0 ? (
                        order.imageUrls.map((url, index) => <div key={index} className={classes.imgWrap}><img className={classes.orderImg} src={`data:image/jpg;base64,${url}`}/></div>)
                      ) : (
                        <div className={classes.notFound}>No images found</div>
                      )}
                    </div>
                  </>
                ) : (
                  <Button 
                    color='primary' 
                    className={classes.reopenButton}
                    onClick={() => handleReopenOrder(order)}
                  >
                    <RefreshIcon />
                    Reopen the order
                  </Button>
                )}
              </Card>
            </Grid>
          )) : (
            <Typography variant="h3" className={classes.noOrders}>
              You have no orders yet
            </Typography>
          )}
        </Grid>
      </Container>
    </S.View>
  );
};

export default LastOrdersView;
