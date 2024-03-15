//Core
import React, { useState } from 'react';

//Components
import ContactCard from '../../components/order/ContactCard';

//Hooks
import { useTranslation } from 'react-i18next';

//Utils

//UI
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
}));

const ContactView = (props) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return <ContactCard />;
};

export default ContactView;
