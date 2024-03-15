//Core
import React, { useState } from 'react';

//Components
import AppMenu from './AppMenu';

//Hooks
import { useTranslation } from 'react-i18next';

//Utils

//UI
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    height: '100vh',
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    minHeight: 48,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(1),
  },
}));

const AppScaffold = (props) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppMenu />
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <p>content</p>
      </main>
    </div>
  );
};

export default AppScaffold;
