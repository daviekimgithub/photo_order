//Core
import React, { useState, useLayoutEffect, useContext } from 'react';

//Components

//Hooks
import { useTranslation } from 'react-i18next';
import { usePhotographer } from '../../contexts/PhotographerContext';
import { AuthContext } from '../../contexts/AuthContext';
import OrderService from '../../services/OrderService';

//Utils
import { formValidationHelper } from '../../core/helpers/formValidationHelper';

//UI
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Switch from '@material-ui/core/Switch';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    padding: '28px',
  },
  textfield: {
    width: '100%',
    marginBottom: '28px',
  },
  title: {
    marginBottom: 0,
  },
}));

const fieldValidation = {
  shippingStreet: {
    error: '',
    minLength: 2,
    maxLength: 150,
  },
  shippingZip: {
    error: '',
    minLength: 3,
    maxLength: 10,
  },
  shippingCity: {
    error: '',
    minLength: 2,
    maxLength: 20,
  },
  shippingCountry: {
    error: '',
    minLength: 2,
    maxLength: 20,
  }
};

const IOSSwitch = withStyles((theme) => ({
  root: {
    width: 42,
    height: 26,
    padding: 0,
    margin: theme.spacing(1),
  },
  switchBase: {
    padding: 1,
    '&$checked': {
      transform: 'translateX(16px)',
      color: theme.palette.common.white,
      '& + $track': {
        backgroundColor: '#52d869',
        opacity: 1,
        border: 'none',
      },
    },
    '&$focusVisible $thumb': {
      color: '#52d869',
      border: '6px solid #fff',
    },
  },
  thumb: {
    width: 24,
    height: 24,
  },
  track: {
    borderRadius: 26 / 2,
    border: `1px solid ${theme.palette.grey[400]}`,
    backgroundColor: theme.palette.grey[400],
    opacity: 1,
    transition: theme.transitions.create(['background-color', 'border']),
  },
  checked: {},
  focusVisible: {},
}))(({ classes, ...props }) => {
  return (
    <Switch
      focusVisibleClassName={classes.focusVisible}
      disableRipple
      classes={{
        root: classes.root,
        switchBase: classes.switchBase,
        thumb: classes.thumb,
        track: classes.track,
        checked: classes.checked,
      }}
      {...props}
    />
  );
});

const UserDeliveryInfo = (props) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const [formValues, setFormValues] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [isChecked, setIsChecked] = useState(false);

  const [photographer] = usePhotographer();
  const { authUser } = useContext(AuthContext);
  const orderService = OrderService();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    const error = formValidationHelper(name, value, fieldValidation);

    setFormErrors((prev) => ({
      ...prev,
      [name]: error,
    }));

    const newFormData = { ...formValues, shippingSelected: true, [name]: value };

    setFormValues(newFormData);
  
    orderService.setCurrentOrderToStorage(
      newFormData, 
      authUser.id
    )
  };

  const setShippingSelection = (e) => {
    const { checked } = e.target;

    if (checked) {
      orderService.setCurrentOrderToStorage(({ ...formValues, shippingSelected: true }), authUser.id)
    } else {
      orderService.setCurrentOrderToStorage({ shippingSelected: false }, authUser.id)
    }
    setIsChecked(!isChecked)
  };

  const renderDeliveryForm = () => {
    if (isChecked) {
      return (
        <Paper square className={classes.paper}>
          <TextField
            required
            name='shippingStreet'
            id='shipping-street'
            label={t('Street Address')}
            variant='outlined'
            className={classes.textfield}
            value={formValues.shippingStreet || ''}
            onChange={handleInputChange}
            error={!!formErrors.shippingStreet}
            helperText={formErrors.shippingStreet}
          />
          <TextField
            required
            type="number"
            name='shippingZip'
            id='shipping-zip'
            label={t('Zip code')}
            variant='outlined'
            className={classes.textfield}
            value={formValues.shippingZip || ''}
            onChange={handleInputChange}
            error={!!formErrors.shippingZip}
            helperText={formErrors.shippingZip}
          />
          <TextField
            required
            name='shippingCity'
            id='shipping-city'
            label={t('City')}
            variant='outlined'
            className={classes.textfield}
            value={formValues.shippingCity || ''}
            onChange={handleInputChange}
            error={!!formErrors.shippingCity}
            helperText={formErrors.shippingCity}
          />
          <TextField
            required
            name='shippingCountry'
            id='shipping-country'
            label={t('Country')}
            variant='outlined'
            className={classes.textfield}
            value={formValues.shippingCountry || ''}
            onChange={handleInputChange}
            error={!!formErrors.shippingCountry}
            helperText={formErrors.shippingCountry}
          />
        </Paper>
      );
    }

    return <></>;
  };

  useLayoutEffect(() => {
    const unsavedOrder = JSON.parse(orderService.getCurrentOrderFromStorage(authUser.id));

    setIsChecked(unsavedOrder?.shippingSelected);

    const initialData = {
      shippingSelected: unsavedOrder?.shippingSelected || false,
      shippingStreet: unsavedOrder?.shippingStreet || authUser.street,
      shippingZip: unsavedOrder?.shippingZip || authUser.zipCode,
      shippingCity: unsavedOrder?.shippingCity || authUser.city,
      shippingCountry: unsavedOrder?.shippingCountry || authUser.country
    };

    setFormValues(initialData);
    
    if (!unsavedOrder) {
      orderService.setCurrentOrderToStorage(
        { shippingSelected: false }, 
        authUser.id
      )
    }
  }, []);

  return (
    <Container maxWidth='md'>
      <p className={classes.title}>
        {t('Add delivery')} (+{photographer.shippingPrice} €)
      </p>
      <IOSSwitch
        name='shipping'
        checked={isChecked}
        onChange={setShippingSelection}
      />
      {renderDeliveryForm()}
    </Container>
  );
};

export default UserDeliveryInfo;
