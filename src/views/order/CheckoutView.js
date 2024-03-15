//Core
import React, { useState } from 'react';

//Components
import SummaryTab from '../../components/order/SummaryTab';
import UserBasicInfo from '../../components/order/UserBasicInfo';
import UserDeliveryInfo from '../../components/order/UserDeliveryInfo';
import UserPaymentInfo from '../../components/order/UserPaymentInfo';
import ThankYouCard from '../../components/order/ThankYouCard';

//Hooks
import { useTranslation } from 'react-i18next';
import { useOrder } from '../../contexts/OrderContext';

//Utils

//UI
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
}));

const CheckoutView = (props) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const [order] = useOrder();

  const showThankYou = order.status === 'SUCCESS';

  return (
    <>
      {showThankYou && <ThankYouCard />}
      {!showThankYou && (
        <>
          <SummaryTab />
          <UserBasicInfo />
          <UserDeliveryInfo />
          <UserPaymentInfo />
        </>
      )}
    </>
  );
};

export default CheckoutView;
