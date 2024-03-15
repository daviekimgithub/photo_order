//Core
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

//Components
import MenuDrawer from './MenuDrawer';
import Zoom from './core/Zoom';

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
    //justifyContent: 'flex-end',
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
    display: 'none',
    alignItems: 'center',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
      width: '100%',
      justifyContent: 'flex-end',
    },
  },
  sectionMobile: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: '16px',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
}));

const AppMenu = ({ photographerId }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const history = useHistory();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [photographer] = usePhotographer();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleProductMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProductMenuClose = () => {
    setAnchorEl(null);
  };

  const redirectToCategoriesList = () => {
    handleProductMenuClose();
    history.push(`/photographer/${photographer.photographId}/categories`);
  };

  const redirectToCategory = (id) => {
    handleProductMenuClose();
    history.push(`/photographer/${photographer.photographId}/categories/${id}`);
  };

  const redirectToUncategorized = () => {
    handleProductMenuClose();
    history.push(`/photographer/${photographer.photographId}/uncategorized`);
  };

  const renderCategories = () => {
    return (
      <div>
        <Typography
          aria-controls='categories-menu'
          aria-haspopup='true'
          onClick={handleProductMenuClick}
          className={classes.navButton}
        >
          <div className={classes.categoryDiv}>
            {t('Categories')} <ExpandMore />
          </div>
        </Typography>
        <Menu
          id='categories-menu'
          anchorEl={anchorEl}
          keepMounted
          open={open}
          onClose={handleProductMenuClose}
          TransitionComponent={Fade}
        >
          <MenuItem key='show_categories' onClick={redirectToCategoriesList}>
            <ListItemIcon>
              <ArrowRightIcon fontSize='small' />
            </ListItemIcon>
            <ListItemText primary={t('All categoires')} />
          </MenuItem>
          <Divider />
          {photographer.productCategories.map((category) => {
            return (
              <MenuItem
                key={category.Id}
                onClick={() => redirectToCategory(category.Id)}
              >
                <ListItemIcon>
                  <ArrowRightIcon fontSize='small' />
                </ListItemIcon>
                <ListItemText primary={category.Name} />
              </MenuItem>
            );
          })}
          <MenuItem key='show_uncategorized' onClick={redirectToUncategorized}>
            <ListItemIcon>
              <ArrowRightIcon fontSize='small' />
            </ListItemIcon>
            <ListItemText primary={t('Others')} />
          </MenuItem>
        </Menu>
      </div>
    );
  };

  const renderProducts = () => {
    return (
      <NavLink
        to={`/photographer/${photographerId}/products`}
        activeStyle={{ fontWeight: 'bold' }}
        className={classes.navButton}
      >
        {t('Products')}
      </NavLink>
    );
  };

  const renderProductsOrCategories = () => {
    if (photographer && photographer.productCategories?.length > 0) {
      return renderCategories();
    } else {
      return renderProducts();
    }
  };

  return (
    <>
      <AppBar
        position='fixed'
        className={clsx(classes.appBar, {
          [classes.appBarShift]: drawerOpen,
        })}
      >
        <Toolbar className={classes.toolbar}>
          <div className={classes.sectionMobile}>
            <IconButton
              color='inherit'
              aria-label='open drawer'
              onClick={() => {
                setDrawerOpen(true);
              }}
              edge='start'
              className={clsx(classes.menuButton, {
                [classes.hide]: drawerOpen,
              })}
            >
              <MenuIcon />
            </IconButton>
          </div>
          <div className={classes.sectionDesktop}>
            <Zoom />
            {renderProductsOrCategories()}
            <NavLink
              to={`/photographer/${photographerId}/checkout`}
              activeStyle={{ fontWeight: 'bold' }}
              className={classes.navButton}
            >
              {t('Finish order')}
            </NavLink>
            <NavLink
              to={`/photographer/${photographerId}/contact`}
              activeStyle={{ fontWeight: 'bold' }}
              className={classes.navButton}
            >
              {t('Contact')}
            </NavLink>
          </div>
        </Toolbar>
      </AppBar>
      <MenuDrawer
        draweropen={drawerOpen}
        photographerId={photographerId}
        requestClose={() => setDrawerOpen(false)}
      />
    </>
  );
};

export default AppMenu;
