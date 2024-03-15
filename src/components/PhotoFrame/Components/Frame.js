import React from 'react';
import useImage from 'use-image';
import { Image, Layer, Rect } from 'react-konva';

const Frame = ({frameUrl, width, height, backPhotoLayersConfig, selectedId, hideSelectors}) =>{
  const [frameImg] = useImage(frameUrl, 'Anonymous');
  const selectedPhoto = backPhotoLayersConfig.find(iL=>iL.id === selectedId);

  return(
    <Layer listening={false}>
      <Image image={frameImg} x={0} y={0} width={width} height={height}/>
      {selectedPhoto && !hideSelectors && <Rect x={selectedPhoto.x} y={selectedPhoto.y} width={selectedPhoto.width} height={selectedPhoto.height} stroke="red" strokeWidth={4}/>}
    </Layer>
  )
}

export default Frame;
