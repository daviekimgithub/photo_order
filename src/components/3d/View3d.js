//Core
import React, { useLayoutEffect, useEffect, useRef, useState } from 'react';

//Components
import Environment from './lib/Environment';
import ModelMaping from './lib/ModelMapping';

//Hooks
import { useTranslation } from 'react-i18next';

//Utils

//UI
import { makeStyles } from '@material-ui/core/styles';

const THREE = require('three');

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
}));

const View3d = ({ textureUrl, modelUrl, saveFn }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const canvas = useRef(null);
  const canvasContainer = useRef(null);
  const canvasContainerLoading = useRef(null);

  const [curentModel, setCurentModel] = useState(null);

  useLayoutEffect(() => {
    const materials = {
      shadow: new THREE.MeshBasicMaterial({
        color: '0x000000',
        // alphaMap: textureShadow,
        transparent: true,
        // depthWrite: false,
        opacity: THREE.Math.lerp(1, 0.25, 0.5),
      }),
      white1: new THREE.MeshPhongMaterial({
        color: 0xffffff,
        shininess: 500,
        reflectivity: 0.8,
      }),
      white2: new THREE.MeshPhongMaterial({
        color: 0xffffff,
        shininess: 500,
        reflectivity: 0.8,
      }),
    };

    const parameters = {
      distance: 400,
      hpoint: 0,
      rotate: true,
      center: 0.5,
    };

    const environment = new Environment(
      canvasContainer.current,
      canvas.current,
      parameters
    );
    const myModel = new ModelMaping(
      environment,
      materials,
      modelUrl,
      canvasContainerLoading.current
    );

    setCurentModel(myModel);

    myModel.setTexture(textureUrl);

    const animation = () => {
      if (!myModel.loading) {
        environment.render();
      }
      requestAnimationFrame(animation);
    };
    animation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!textureUrl) return;
    if (!curentModel) return;

    curentModel.setTexture(textureUrl);
    const model = {
      fileAsBase64: textureUrl,
    };
    saveFn(model);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [textureUrl]);

  return (
    <div
      className='canvasContainer'
      style={{
        height: '100%',
        minHeight: '500px',
        width: '100%',
        outline: 'none',
        border: 'none',
      }}
      ref={canvasContainer}
    >
      <canvas ref={canvas} />
      <div
        className='canvasContainer-loading canvasContainer-loading--active'
        ref={canvasContainerLoading}
      />
    </div>
  );
};

export default View3d;
