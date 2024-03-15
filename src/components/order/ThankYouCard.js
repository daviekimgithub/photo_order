//Core
import React, { useState, useEffect } from 'react';

//Components

//Hooks
import { useTranslation } from 'react-i18next';
import { usePhotographer } from '../../contexts/PhotographerContext';
import { useOrder } from '../../contexts/OrderContext';

//Utils
import OrderService from '../../services/OrderService';

//UI
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    padding: '28px',
  },
  gridConainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '100%',
    maxWidth: '200px',
  },
  noPadding: {
    padding: '0 !important',
  },
  link: {
    textDecoration: 'none',
    color: '#3a3a3a',
  },
  conatiner: {
    paddingTop: '16px'
  }
}));

const ActiveButton = withStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: '320px',
    color: 'white',
    borderRadius: '50px',
    padding: '12px 28px',
    backgroundColor: '#28a745',
    '&:hover': {
      backgroundColor: '#218838',
    },
  },
}))(Button);

const ThankYouCard = (props) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const [photographer] = usePhotographer();
  const [order, orderDispatch] = useOrder();

  const orderService = OrderService();
  const orderDataFromStorage = JSON.parse(orderService.getCurrentOrderFromStorage(photographer.photographId));

  return (
    <Container maxWidth='md' className={classes.conatiner} >
      <Paper square className={classes.paper}>
        <Grid
          container
          spacing={3}
          className={classes.gridConainer}
          direction='column'
        >
          <Grid item>
            <img
              src={photographer.logoUrl}
              alt='company logo'
              className={classes.logo}
            />
          </Grid>
          <Grid item>
            {
              order.orderId || orderDataFromStorage?.orderId
                ? (
                  <>
                    <Typography variant='h5' component='p' align='center'>
                      Order no:
                    </Typography>
                    <Typography variant='h4' component='h1' align='center'>
                      {order.orderId || orderDataFromStorage?.orderId}
                    </Typography>
                  </>
                ) : (
                  <Typography variant='h5' component='p' align='center'>
                    Order
                  </Typography>
                ) 
            }
            <Typography variant='h5' component='p' align='center'>
              has been accepted
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant='h4' component='p'>
              {photographer.companyName}
            </Typography>
          </Grid>
          <Grid item className={classes.noPadding}>
            <Typography variant='body1'>{photographer.street}</Typography>
          </Grid>
          <Grid item className={classes.noPadding}>
            <Typography variant='body1'>{photographer.phone}</Typography>
          </Grid>
          <Grid item>
            <Typography variant='body1'>
              <a href={`mailto:${photographer.email}`} className={classes.link}>
                {photographer.email}
              </a>
            </Typography>
          </Grid>
          <Grid item>
            <ActiveButton
              size='large'
              onClick={() => orderDispatch({ type: 'NEW' })}
            >
              {t('Order more photos')}
            </ActiveButton>
          </Grid>
          {photographer.website && (
            <Grid item>
              <a href={`//${photographer.website}`} className={classes.link}>
                {t('thankyou-exit')}
              </a>
            </Grid>
          )}
        </Grid>
      </Paper>
    </Container>
  );
};

export default ThankYouCard;
