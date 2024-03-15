import React, { useState, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useOrder } from '../../contexts/OrderContext';
import { valueValidationHelper } from '../../core/helpers/formValidationHelper';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { AuthContext } from '../../contexts/AuthContext';
import OrderService from '../../services/OrderService';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
  error: {
    color: '#dc3545',
  },
  progress: {
    marginLeft: '8px',
  },
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

const DisabledButton = withStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: '320px',
    color: '#d4d4d4',
    borderRadius: '50px',
    padding: '12px 28px',
    cursor: 'not-allowed',
    backgroundColor: '#343a40',
    '&:hover': {
      backgroundColor: '#4a444a',
    },
  },
}))(Button);

const HtmlTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 420,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}))(Tooltip);

const SendOrderButton = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  
  const orderService = OrderService();
  const { authUser } = useContext(AuthContext); 
  
  const getOrderFromStorage = () => {
    return JSON.parse(orderService.getCurrentOrderFromStorage(authUser.id));
  };

  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [order, orderDispatch] = useOrder();
  const [errors, setErrors] = useState([]);
  const [orderData, setOrderData] = useState();

  const clearMissingValue = (value) => (value === undefined || value === 'missing' ? '' : value);

  useEffect(() => {
    const interval = setInterval(() => {
      setOrderData(getOrderFromStorage());
    }, 1500);
    return () => clearInterval(interval);
  });

  useEffect(() => {
    const validateSendOrder = () => {
      const orderData = getOrderFromStorage();
      const newErrors = [];

      const validateField = (fieldName, value, options) => {
        const error = valueValidationHelper(t(fieldName), clearMissingValue(value), options);
        if (error) newErrors.push(error);
      };

      validateField('First name', orderData?.firstName || "", { minLength: 2, maxLength: 50 });
      validateField('Last name', orderData?.lastName || "", { minLength: 2, maxLength: 50 });
      validateField('Email', orderData?.email || "", { validate: 'email' });
      validateField('Phone', orderData?.phone || "", { validate: 'phone' });

      if (orderData.orderItems.reduce((sum, item) => sum + item.qty, 0) === 0) {
        newErrors.push(t('No products in the cart'));
      }

      return newErrors;
    };

    setErrors(validateSendOrder());
  }, [
    order.orderItems, 
    orderData?.firstName, 
    orderData?.lastName, 
    orderData?.email, 
    orderData?.phone
  ]);

  const handleSendOrder = () => {
    const orderData = getOrderFromStorage();
    orderDispatch({ type: 'FINALIZE' });
    orderService.setCurrentOrderToStorage({ ...orderData, status: 'FINALIZE' }, authUser.id)
  };

  const renderChildren = () => {
    if (order.status === 'FINALIZING') {
      return (
        <>
          {t('Sending')} <CircularProgress size={22} className={classes.progress} />
        </>
      );
    }

    if (order.status === 'SUCCESS') {
      return t('SUCCESS');
    }

    return t('Send order');
  };

  if (errors.length === 0) {
    return (
      <ActiveButton
        size='large'
        onClick={() => handleSendOrder()}
        disabled={errors.length !== 0}
      >
        {renderChildren()}
      </ActiveButton>
    );
  };

  return (
    <ClickAwayListener onClickAway={() => setTooltipOpen(false)}>
      <HtmlTooltip
        open={tooltipOpen}
        arrow
        enterDelay={500}
        leaveDelay={500}
        title={
          <React.Fragment>
            <Typography className={classes.error}>Can't continue</Typography>
            {errors.map((error, index) => (
              <li key={`validation_error_${index}`}>{error}</li>
            ))}
          </React.Fragment>
        }
      >
        <DisabledButton
          size='large'
          onClick={() => setTooltipOpen(true)}
          onMouseEnter={() => setTooltipOpen(true)}
        >
          {renderChildren()}
        </DisabledButton>
      </HtmlTooltip>
    </ClickAwayListener>
  );
};

export default SendOrderButton;
