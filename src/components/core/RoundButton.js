//Core
import React, { useState } from 'react';

//Components

//Hooks
import { useTranslation } from 'react-i18next';

//Utils

//UI
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  rootBtn: {
    width: '50%',
    color: '#4556ac',
    '&:hover': {
      color: '#fff',
      backgroundColor: '#4556ac',
    },
  },
  borderBtn: {
    border: '1px solid',
    borderColor: '#4556ac',
    borderRadius: '50px',
    '&:hover': {
      borderColor: '#4556ac',
    },
  },
  paddingsBtn: {
    paddingTop: '8px',
    paddingBottom: '8px',
    paddingLeft: '20px',
    paddingRight: '20px',
  },
}));

const RoundButton = ({ children, onClick, ...props }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <Button
      className={`${classes.rootBtn} ${classes.borderBtn} ${classes.paddingsBtn}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </Button>
  );
};

export default RoundButton;
