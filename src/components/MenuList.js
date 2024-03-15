//Core
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

//Components

//Hooks
import { useTranslation } from 'react-i18next';
import { usePhotographer } from '../contexts/PhotographerContext';

//Utils

//UI
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import ContactPhoneIcon from '@material-ui/icons/ContactPhone';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import Divider from '@material-ui/core/Divider';
import HistoryIcon from '@material-ui/icons/History';
import PolicyIcon from '@material-ui/icons/Policy';
import SettingsIcon from '@material-ui/icons/Settings';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  gutters: {
    paddingLeft: 12,
  },
}));

const MenuList = (props) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const [categoriesListOpen, setCategoriesListOpen] = useState(false);
  const [photographer] = usePhotographer();

  const renderProducts = () => {
    return (
      <ListItem
        className={classes.gutters}
        button
        onClick={() => props.requestClose && props.requestClose()}
        component={Link}
        to={`/photographer/${props.photographerId}/products`}
      >
        <ListItemIcon>
          <AddShoppingCartIcon />
        </ListItemIcon>
        <ListItemText>{t('Products')}</ListItemText>
      </ListItem>
    );
  };

  const renderCategories = () => {
    return (
      <>
        <ListItem
          className={classes.gutters}
          button
          onClick={() => {
            setCategoriesListOpen(!categoriesListOpen);
          }}
        >
          <ListItemIcon>
            <ArrowRightIcon />
          </ListItemIcon>
          <ListItemText primary={t('Categories')} />
          {categoriesListOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse
          className={classes.gutters}
          in={categoriesListOpen}
          timeout='auto'
          unmountOnExit
        >
          <List component='div' disablePadding>
            {photographer.productCategories.map((category) => {
              return (
                <ListItem
                  key={`mobile_category_${category.Id}`}
                  className={classes.gutters}
                  button
                  onClick={() => props.requestClose && props.requestClose()}
                  component={Link}
                  to={`/photographer/${photographer.photographId}/categories/${category.Id}`}
                >
                  <ListItemIcon>
                    <ArrowRightIcon />
                  </ListItemIcon>
                  <ListItemText>{category.Name}</ListItemText>
                </ListItem>
              );
            })}
            <ListItem
              key={`mobile_uncategorized`}
              className={classes.gutters}
              button
              onClick={() => props.requestClose && props.requestClose()}
              component={Link}
              to={`/photographer/${photographer.photographId}/uncategorized`}
            >
              <ListItemIcon>
                <ArrowRightIcon />
              </ListItemIcon>
              <ListItemText>{t('Others')}</ListItemText>
            </ListItem>
          </List>
        </Collapse>
      </>
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
    <List>
      {renderProductsOrCategories()}
      <ListItem
        className={classes.gutters}
        button
        onClick={() => props.requestClose && props.requestClose()}
        component={Link}
        to={`/photographer/${props.photographerId}/settings`}
      >
        <ListItemIcon>
          <SettingsIcon />
        </ListItemIcon>
        <ListItemText>{t('Settings')}</ListItemText>
      </ListItem>
      <ListItem
        className={classes.gutters}
        button
        onClick={() => props.requestClose && props.requestClose()}
        component={Link}
        to={`/photographer/${props.photographerId}/checkout`}
      >
        <ListItemIcon>
          <ShoppingCartIcon />
        </ListItemIcon>
        <ListItemText>{t('Finish order')}</ListItemText>
      </ListItem>
      <ListItem
        className={classes.gutters}
        button
        onClick={() => props.requestClose && props.requestClose()}
        component={Link}
        to={`/photographer/${props.photographerId}/contact`}
      >
        <ListItemIcon>
          <ContactPhoneIcon />
        </ListItemIcon>
        <ListItemText>{t('Contact')}</ListItemText>
      </ListItem>
      <ListItem
        className={classes.gutters}
        button
        onClick={() => props.requestClose && props.requestClose()}
        component={Link}
        to={`/photographer/${props.photographerId}/last-orders`}
      >
        <ListItemIcon>
          <HistoryIcon />
        </ListItemIcon>
        <ListItemText>{t('Last Orders')}</ListItemText>
      </ListItem>
      <ListItem
        className={classes.gutters}
        button
        onClick={() => props.requestClose && props.requestClose()}
        component={Link}
        to={`/photographer/${props.photographerId}/policy`}
      >
        <ListItemIcon>
          <PolicyIcon />
        </ListItemIcon>
        <ListItemText>{t('Privacy Policy')}</ListItemText>
      </ListItem>
    </List>
  );
};

export default MenuList;
