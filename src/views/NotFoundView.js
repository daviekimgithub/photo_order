//Core
import React, { useState } from 'react';
import { ReactComponent as ProjectLogo } from '../assets/oiSTIGMES_logo.svg';

//Components

//Hooks
import { useTranslation } from 'react-i18next';

//Utils

//UI
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

const NotFound = (props) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <div className={classes.root}>
      <ProjectLogo />
      <Typography variant='h1' component='h2' gutterBottom>
        404
      </Typography>
    </div>
  );
};

export default NotFound;
