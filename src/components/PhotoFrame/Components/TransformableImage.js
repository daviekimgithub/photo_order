import React from 'react';
import { Image, Transformer } from 'react-konva';
import useImage from 'use-image';

const TransformableImage = ({ shapeProps, imgRef, isSelected, onSelect, onChange }) => {
  const [image] = useImage(shapeProps.img.props.src, 'Anonymous');
  const isEditable = image ? image.src.indexOf("https")>=0 : false;
  
  return (
    <Image
      image={image}
      stroke={"#f00"}
      strokeWidth={isSelected?5:0}
      opacity={isEditable ? 1 : 0.3}
      onClick={isEditable && onSelect}
      onTap={isEditable && onSelect}
      ref={el => imgRef.current[shapeProps.id] = el}
      {...shapeProps}
      draggable={isEditable}
      onDragEnd={(e) => {
        onChange({
          ...shapeProps,
          x: e.target.x(),
          y: e.target.y(),
        });
      }}
      onTransformEnd={(e) => {
        // transformer is changing scale of the node
        // and NOT its width or height
        // but in the store we have only width and height
        // to match the data better we will reset scale on transform end
        const node = imgRef.current[shapeProps.id];
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();

        // we will reset it back
        node.scaleX(1);
        node.scaleY(1);
        onChange({
          ...shapeProps,
          x: node.x(),
          y: node.y(),
          // set minimal value
          width: Math.max(0, node.width() * scaleX),
          height: Math.max(node.height() * scaleY),
        });
      }}
    />
  );
};

export default TransformableImage;
