//Core
import React, { useState, useLayoutEffect, useContext } from 'react';

//Components

//Hooks
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../../contexts/AuthContext';
import OrderService from '../../services/OrderService';

//Utils
import { formValidationHelper } from '../../core/helpers/formValidationHelper';

//UI
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';

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
}));

const fieldValidation = {
  firstName: {
    error: '',
    minLength: 2,
    maxLength: 50,
  },
  lastName: {
    error: '',
    minLength: 2,
    maxLength: 50,
  },
  email: {
    error: '',
    validate: 'email',
  },
  phone: {
    error: '',
    validate: 'phone',
    maxLength: 14,
  },
};

const UserBasicInfo = (props) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [formValues, setFormValues] = useState({});
  const [formErrors, setFormErrors] = useState({});

  const { authUser } = useContext(AuthContext);
  const orderService = OrderService();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    const error = formValidationHelper(name, value, fieldValidation);

    setFormErrors((prev) => ({
      ...prev,
      [name]: error,
    }));

    const newFormData = { ...formValues, [name]: value };

    setFormValues(newFormData);
  
    orderService.setCurrentOrderToStorage(
      newFormData, 
      authUser.id
    )
  };

  useLayoutEffect(() => {
    const unsavedOrder = JSON.parse(orderService.getCurrentOrderFromStorage(authUser.id));

    const initialData = {
      firstName: unsavedOrder?.firstName || authUser.firstName,
      lastName: unsavedOrder?.lastName || authUser.lastName,
      email: unsavedOrder?.email || authUser.email,
      phone: unsavedOrder?.phone || authUser.phone
    };

    setFormValues(initialData);

    orderService.setCurrentOrderToStorage(
      initialData, 
      authUser.id
    )
  }, []);

  return (
    <Container maxWidth='md'>
      <p>Basic informations</p>
      <Paper square className={classes.paper}>
        <TextField
          required
          name='firstName'
          id='basic-first-name'
          label={t('First name')}
          variant='outlined'
          className={classes.textfield}
          value={formValues.firstName || ''}
          onChange={handleInputChange}
          error={!!formErrors.firstName}
          helperText={formErrors.firstName}
        />
        <TextField
          required
          name='lastName'
          id='basic-last-name'
          label={t('Last name')}
          variant='outlined'
          className={classes.textfield}
          value={formValues.lastName || ''}
          onChange={handleInputChange}
          error={!!formErrors.lastName}
          helperText={formErrors.lastName}
        />
        <TextField
          required
          name='email'
          id='basic-email'
          label={t('Email')}
          variant='outlined'
          className={classes.textfield}
          value={formValues.email || ''}
          onChange={handleInputChange}
          error={!!formErrors.email}
          helperText={formErrors.email}
        />
        <TextField
          required
          name='phone'
          id='basic-phone'
          label={t('Phone')}
          variant='outlined'
          className={classes.textfield}
          value={formValues.phone || ''}
          onChange={handleInputChange}
          error={!!formErrors.phone}
          helperText={formErrors.phone}
        />
      </Paper>
    </Container>
  );
};

export default UserBasicInfo;
