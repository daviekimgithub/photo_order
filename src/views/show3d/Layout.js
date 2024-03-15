//Core
import React, { useState } from 'react';

//Components
import Share3dMenu from '../../components/Share3dMenu';

//Hooks
import { useTranslation } from 'react-i18next';

//Utils

//UI
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    backgroundColor: '#f8f8f8',
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    minHeight: 80,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(1),
  },
}));

const Layout = ({ children, photographerId, productId }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Share3dMenu photographerId={photographerId} productId={productId} />
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {children}
      </main>
    </div>
  );
};

export default Layout;
