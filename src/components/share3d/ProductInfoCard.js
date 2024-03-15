//Core
import React from 'react';

//Components

//Hooks
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

//Utils
import { formatPrice, getShare3dPrice } from '../../core/helpers/priceHelper';

//UI
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
  card: {
    maxWidth: '600px',
    position: 'fixed',
  },
  fullWidth: {
    width: '100%',
  },
  media: {
    width: '100%',
    height: 340,
    backgroundSize: 'contain',
  },
  cardArea: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  cardTitle: {
    fontSize: '1.3rem',
    lineHeight: '1.8rem',
    fontWeight: 600,
    display: 'inline-block',
  },
  cardTitleBox: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '16px',
  },
  cardDesc: {
    fontSize: '1.1rem',
    lineHeight: '1.3rem',
    marginBottom: '16px',
  },
  btnCenter: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    position: 'fixed',
  },
}));

const ActiveButton = withStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: '320px',
    position: 'fixed',
    bottom: '10px',
    color: 'white',
    borderRadius: '50px',
    padding: '12px 28px',
    backgroundColor: '#28a745',
    '&:hover': {
      backgroundColor: '#218838',
    },
  },
}))(Button);

const ProdyctInfoCard = ({ product }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const history = useHistory();

  const handleCreateNew = () => {
    history.push(
      `/photographer/${product.photographerId}/products/${product.id}`
    );
  };
  return (
    <>
      {product && (
        <div className={classes.root}>
          <div className={classes.btnCenter}>
            <ActiveButton size='large' onClick={handleCreateNew}>
              {t('Create own')}
            </ActiveButton>
          </div>
        </div>
      )}
    </>
  );
};

export default ProdyctInfoCard;
