//Core
import React, { useState } from 'react';

//Components

//Hooks
import { useTranslation } from 'react-i18next';

//Utils

//UI
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import TextFormatIcon from '@material-ui/icons/TextFormat';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  btn_group: {
    marginRight: '8px',
  },
}));

const Zoom = (props) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const [zoom, setZoom] = useState(100);

  function setZoom100() {
    document.body.style.zoom = '100%';
    setZoom(100);
  }

  function setZoom125() {
    document.body.style.zoom = '125%';
    setZoom(125);
  }

  function setZoom150() {
    document.body.style.zoom = '150%';
    setZoom(150);
  }

  return (
    <>
      <ButtonGroup
        variant='text'
        color='primary'
        aria-label='accessibility text transformation'
        className={classes.btn_group}
      >
        <Button
          className={`${classes.rootBtn} ${classes.borderBtn} ${classes.paddingsBtn}`}
          onClick={setZoom100}
          disabled={zoom === 100}
          {...props}
        >
          <TextFormatIcon fontSize='small' />
        </Button>
        <Button
          className={`${classes.rootBtn} ${classes.borderBtn} ${classes.paddingsBtn}`}
          onClick={setZoom125}
          disabled={zoom === 125}
          {...props}
        >
          <TextFormatIcon fontSize='medium' />
        </Button>
        <Button
          className={`${classes.rootBtn} ${classes.borderBtn} ${classes.paddingsBtn}`}
          onClick={setZoom150}
          disabled={zoom === 150}
          {...props}
        >
          <TextFormatIcon fontSize='large' />
        </Button>
      </ButtonGroup>
    </>
  );
};

export default Zoom;
