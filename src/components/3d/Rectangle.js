//Core
import { Rect, Transformer, Image } from 'react-konva';
import React, { useRef, useEffect } from 'react';

//Components

//Hooks
import { useTranslation } from 'react-i18next';
import useImage from 'use-image';

//Utils
import { Portal } from 'react-konva-utils';

//UI
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
}));

const Rectangle = ({ layer, isSelected, onSelect, onChange }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const imgRef = useRef();
  const rectRef = useRef();
  const trRef = useRef();

  const [image] = useImage(layer.url, 'anonymous');

  useEffect(() => {
    if (isSelected) {
      // we need to attach transformer manually
      trRef.current.nodes([imgRef.current, rectRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <Image
        image={image}
        onClick={onSelect}
        onTap={onSelect}
        ref={imgRef}
        x={layer.x}
        y={layer.y}
        width={layer.width}
        height={layer.height}
        onDragEnd={(e) => {
          
          
          onChange({
            ...layer,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={(e) => {
          const node = imgRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          node.scaleX(1);
          node.scaleY(1);
          onChange({
            ...layer,
            x: node.x(),
            y: node.y(),
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(node.height() * scaleY),
          });
        }}

      />
      {isSelected && (
        <Portal selector='.top-layer' enabled>
          <Rect
            x={layer.x}
            y={layer.y}
            width={layer.width}
            height={layer.height}
            draggable
            ref={rectRef}
          />
          <Transformer
            ref={trRef}
            rotateEnabled={false}
            enabledAnchors={[
              'top-left',
              'top-right',
              'bottom-left',
              'bottom-right',
            ]}
            boundBoxFunc={(oldBox, newBox) => {
              // limit resize
              if (newBox.width < 10 || newBox.height < 10) {
                return oldBox;
              }
              return newBox;
            }}
          />
        </Portal>
      )}
    </>
  );
};

export default Rectangle;
