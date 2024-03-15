//Core
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

//Components
import MenuDrawer from './MenuDrawer';

//Hooks
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { usePhotographer } from '../contexts/PhotographerContext';

//Utils
import clsx from 'clsx';

//UI
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Fade from '@material-ui/core/Fade';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import Divider from '@material-ui/core/Divider';
import ExpandMore from '@material-ui/icons/ExpandMore';

const drawerWidth = 260;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    backgroundColor: '#fff',
    color: '#8f8f8f',
    height: '64px',
    justifyContent: 'center',
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
    height: 20,
    width: 20,
  },
  closeButton: {
    height: 20,
    width: 20,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(5) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(6) + 1,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(0, 1),
    minHeight: 48,
    //  height: 35
  },
  regular: {
    minHeight: 48,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(1),
  },
  gutters: {
    paddingLeft: 12,
  },
  title: {
    flexGrow: 1,
  },
  colorSecondary: {
    padding: 6,
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    '&:focus': {
      outline: 0,
      border: 0,
    },
  },
  navButton: {
    color: '#8f8f8f',
    width: '100px',
    textAlign: 'center',
    marginLeft: '5px',
    marginRight: '5px',
    textDecoration: 'none',
    fontSize: '1rem',
    cursor: 'pointer',
  },
  categoryDiv: {
    display: 'flex',
    alignItems: 'center',
  },
  sectionDesktop: {
    display: 'flex',
    alignItems: 'center',
  },
  gift: {
    fontSize: '26px',
  },
}));

const Share3dMenu = ({ photographerId, productId }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <>
      <AppBar position='fixed' className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <div className={classes.sectionDesktop}>
            <p className={classes.gift}>{t('Best gift')}</p>
          </div>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Share3dMenu;
