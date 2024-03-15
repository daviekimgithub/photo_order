//Core
import React, { useRef, useState, useLayoutEffect, useEffect } from 'react';
import { Image, Layer, Stage } from 'react-konva';

//Components
import View3d from '../../components/3d/View3d';

//Hooks
import { useTranslation } from 'react-i18next';

//Utils
import useImage from 'use-image';

//UI
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    minHeight: '80px',
  },
}));

const Presenter3d = ({ product, layerUrl }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const stageLayerRef = useRef(null);

  const [image, status] = useImage(layerUrl, 'anonymous');

  return (
    <>
      {product && layerUrl && (
        <View3d
          modelUrl={product.objUrl}
          textureUrl={layerUrl}
          saveFn={(e) => {}}
        />
      )}
    </>
  );
};

export default Presenter3d;
