//Core
import React, { useState } from 'react';

//Components

//Hooks
import { useTranslation } from 'react-i18next';

//Utils

//UI
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Chip from '@material-ui/core/Chip';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  container: {
    position: 'relative',
    top: '20px',
    left: '-10px',
    zIndex: '100',
    height: '0px',
  },
  badge: {
    marginBottom: '12px',
    display: 'flex',
    maxWidth: '120px',
  },
  selected: {
    backgroundColor: '#3e884f',
    color: '#fff',
  },
  prints: {
    backgroundColor: '#4556ac',
    color: '#fff',
  },
  files: {
    backgroundColor: '#c43d4b',
    color: '#fff',
  },
}));

const CardBadge = ({ files, prints }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const showComponent = () => {
    if (!files || files < 1) return false;
    if (!prints || prints < 1) return false;

    return true;
  };

  return (
    <>
      {showComponent() && (
        <div className={classes.container}>
          <Chip
            size='small'
            label={t('SELECTED')}
            className={[classes.badge, classes.selected]}
          />
          <Chip
            size='small'
            label={`${t('PRINTS')}: ${files}`}
            className={[classes.badge, classes.prints]}
          />
          <Chip
            size='small'
            label={`${t('FILES')}: ${prints}`}
            className={[classes.badge, classes.files]}
          />
        </div>
      )}
    </>
  );
};

export default CardBadge;
