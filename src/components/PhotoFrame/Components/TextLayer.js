import React, {useEffect, useState, useRef} from 'react';
import { Image, Layer, Text, TextPath } from 'react-konva';


const TextLayer = ({config, setConfig, onSelect}) =>{
    const textRef = useRef();
    const [offsetX, setOffsetX] = useState(0);
    const [offsetY, setOffsetY] = useState(0);

    useEffect(()=>{
      setOffsetX(textRef.current.textWidth/2)
      setOffsetY(textRef.current.textHeight/2)
    }, [config])


    return(
      <Layer>
        <Text
          ref={textRef}
          x={config.x}
          y={config.y}
          offsetX={offsetX}
          offsetY={offsetY}
          rotation={config.rotation}
          text={config.text}
          fontFamily={config.fontFamily}
          fontSize={config.fontSize}
          fill={config.fillColor}
          stroke={config.strokeColor}
          strokeWidth={config.strokeWidth}
          draggable
          onClick={onSelect}
          onTap={onSelect}
          onDragEnd={(e) => {
            setConfig({...config, ...e.target._lastPos});
          }}
        />
      </Layer>
    )
}

export default TextLayer;
