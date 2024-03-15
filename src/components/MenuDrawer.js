//Core
import React, { useState } from 'react';

//Components
import MenuList from './MenuList';

//Hooks
import { useTranslation } from 'react-i18next';

//Utils

//UI
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import clsx from 'clsx'; // this is for controling dynamic class name assingment

const drawerWidth = 260;
const anchor = 'left';

const useStyles = makeStyles((theme) => ({
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
    display: 'flex',
    justifyContent: 'space-between'
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
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    minHeight: 48,
    //  height: 35
  },
  currentVersion: {
    padding: '12px',
  }
}));

const MenuDrawer = (props) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const getCurrentVersion = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear().toString().slice(-2);
    const month = (currentDate.getMonth() + 1).toString();
    const day = currentDate.getDate().toString();
  
    return `ver 1.${year}.${month}.${day}`;
  };  

  return (
    <Drawer
      className={clsx(classes.drawer, {
        [classes.drawerOpen]: props.draweropen,
        [classes.drawerClose]: !props.draweropen,
      })}
      classes={{
        paper: clsx({
          [classes.drawerOpen]: props.draweropen,
          [classes.drawerClose]: !props.draweropen,
        }),
      }}
      anchor={anchor}
      open={props.draweropen}
      onClose={() => props.requestClose && props.requestClose()}
    >
      <MenuList
        requestClose={() => props.requestClose && props.requestClose()}
        photographerId={props.photographerId}
      />
      <div className={classes.currentVersion}>{getCurrentVersion()}</div>
    </Drawer>
  );
};

export default MenuDrawer;
