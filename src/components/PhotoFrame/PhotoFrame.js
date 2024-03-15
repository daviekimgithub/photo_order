import React, {useEffect, useState} from 'react';
import { useImageSize } from 'react-image-size';
import { Stage, Layer } from 'react-konva';

//UI
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

import Frame from './Components/Frame';
import TextLayer from './Components/TextLayer';
import TransformableImage from './Components/TransformableImage';
import TextTransformer from './Components/TextTransformer';
import ScaleAndRotationTransformer from './Components/ScaleAndRotationTransformer';
import Menu from './Components/Menu';

const useStyles = makeStyles((theme) => ({
  centerContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: "300px",
}}));

const PhotoFrame = ({ stepData, frameUrl, photos, hideSelectors, setSelectedPhoto, setEditorRef, setEditorRatio, replaceFileBtn, removeFileBtn, addFloatingImageBtn }) => {

    const initialize = () =>{
      const ratio = data.width/parentWidth;
      const frameWidth = data.width/ratio;
      const frameHeight = data.height/ratio;

      const backPhotoLayersConfig = stepData.filter(d=>d.productConfig).map((d,i)=>{return{
        id: "photo"+i,
        x:d.productConfig.positionX/ratio,
        y:d.productConfig.positionY/ratio,
        width:d.productConfig.width/ratio,
        height:d.productConfig.height/ratio,
        clipX: 0,
        clipY: 0,
        clipWidth: d.productConfig.width/ratio,
        clipHeight: d.productConfig.height/ratio
      }});
      const newBackPhotoLayers = [];
      backPhotoLayersConfig.forEach((iL,i)=>{
        const photo = photos[i];
        if(photo){
          let newBackPhotoLayer = {};
          if(backPhotoLayers[i] && backPhotoLayers[i].img.props.src === photo.props.src){
            newBackPhotoLayer = backPhotoLayers[i];
          }else{
            const layerRatio = iL.width / iL.height;
            const photoRatio = photo.props.naturalWidth / photo.props.naturalHeight;

            let width = 0;
            let height = 0;

            if(layerRatio > photoRatio){
              width = iL.width;
              height = photo.props.naturalHeight * (iL.width / photo.props.naturalWidth );
            }else{
              width = photo.props.naturalWidth * (iL.height / photo.props.naturalHeight );
              height = iL.height;
            }
            newBackPhotoLayer.x = iL.width/2;
            newBackPhotoLayer.y = iL.height/2;
            newBackPhotoLayer.offsetX = width/2;
            newBackPhotoLayer.offsetY = height/2;
            newBackPhotoLayer.width = width;
            newBackPhotoLayer.height = height;
            newBackPhotoLayer.id = "photo"+i;
            newBackPhotoLayer.img = photo;
          }
          newBackPhotoLayers.push(newBackPhotoLayer);
        }
      })

      const newFrontPhotoLayers = stepData.filter(d=>!d.productConfig).map((d,i)=>{
        const photo = photos[newBackPhotoLayers.length+i];
        const regex = "[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}"
        const photoGuid = [...photo.props.src.matchAll(regex)].slice(-1)[0][0];
        if(frontPhotoLayers[i]){
          const frontPhotoLayer = frontPhotoLayers.find(fpl=>[...fpl.img.props.src.matchAll(regex)].slice(-1)[0][0] === photoGuid);
          if(frontPhotoLayer){
            return frontPhotoLayer;
          }
        }

        const frameRatio = frameWidth / frameHeight;
        const photoRatio = photo.props.naturalWidth / photo.props.naturalHeight;

        let width = 0;
        let height = 0;

        if(frameRatio > photoRatio){
          width = frameWidth;
          height = photo.props.naturalHeight * (frameWidth / photo.props.naturalWidth );
        }else{
          width = photo.props.naturalWidth * (frameHeight / photo.props.naturalHeight );
          height = frameHeight;
        }
        width = width/4;
        height = height/4;

        return{
          x: frameWidth/2,
          y: frameHeight/2,
          offsetX: width/2,
          offsetY: height/2,
          width: width,
          height: height,
          id: "frontPhoto"+photoGuid,
          img: photo,
        }
      });

      setFrameWidth(frameWidth);
      setFrameHeight(frameHeight);
      setRatio(ratio);
      setEditorRatio(ratio);
      setBackPhotoLayersConfig(backPhotoLayersConfig);
      setFrontPhotoLayers(newFrontPhotoLayers);
      setBackPhotoLayers(newBackPhotoLayers);
    }

    const [selectedId, setSelectId] = useState(null);
    const [textSelectedId, setTextSelectedId] = useState(null);
    const [transformerPosition, setTransformerPosition] = useState(null);
    const [parentWidth, setParentWidth] = useState(0);
    const [frameWidth, setFrameWidth] = useState();
    const [frameHeight, setFrameHeight] = useState();
    const [ratio, setRatio] = useState(0);
    const [backPhotoLayersConfig, setBackPhotoLayersConfig] = useState();
    const [backPhotoLayers, setBackPhotoLayers] = useState([]);
    const [frontPhotoLayers, setFrontPhotoLayers] = useState([]);
    const [textLayers, setTextLayers] = useState([]);
    const classes = useStyles();
    const imgRef = React.useRef([]);
    const trRef = React.useRef();
    const stageRef = React.useRef(null);
    const parentRef = React.useRef(null);
    const [data, { loading, error }] = useImageSize(frameUrl);

    useEffect(()=>{
      setParentWidth(parentRef.current.offsetWidth);
    },[parentRef]);

    useEffect(()=>{
      if(data && !loading && !error){
        initialize();
      }
    },[data, loading, error, parentWidth, photos]);

    useEffect(() => {
      setEditorRef(stageRef);
    },[stageRef])

    useEffect(() => {
      const ref = imgRef.current[selectedId];
      if (ref && trRef.current) {
        trRef.current.nodes([ref]);
        trRef.current.getLayer().batchDraw();
      }
    }, [selectedId, trRef]);

    useEffect(() =>{
      const backPhotoSelectedIdx = backPhotoLayers.indexOf(backPhotoLayers.find((img,i)=>img.id === selectedId));
      const frontPhotoSelectedIdx = frontPhotoLayers.indexOf(frontPhotoLayers.find((img,i)=>img.id === selectedId));

      if(backPhotoSelectedIdx>=0){
        setTransformerPosition(backPhotoLayersConfig[backPhotoSelectedIdx]);
        setSelectedPhoto(backPhotoSelectedIdx);
      }else if(frontPhotoSelectedIdx>=0){
          setTransformerPosition(null);
          setSelectedPhoto(backPhotoLayers.length + frontPhotoSelectedIdx);
      }else{
        setTransformerPosition(null);
        setSelectedPhoto(-1);
      }
    }, [selectedId, frontPhotoLayers]);

    const checkDeselect = (e) => {
      const clickedOnEmpty = e.target === e.target.getStage();
      if (clickedOnEmpty) {
        setSelectId(null);
        setTextSelectedId(null);
      }
    };

    const addText = () =>{
      const newTextLayer = {
        x:100,
        y:100,
        rotation:0,
        text: "test",
        fontFamily: "Arial",
        fontSize: 100,
        fillColor: "#000000",
        strokeColor: "#ff0000"
      }
      setTextLayers([...textLayers, newTextLayer]);
      setTextSelectedId(textLayers.length);
    }
    
    let composerView = (<CircularProgress />);
    if(data && !loading && !error && backPhotoLayersConfig){
      composerView = (
        <>
          <Stage
            width={frameWidth}
            height={frameHeight}
            ref={stageRef}
            onMouseDown={checkDeselect}
            onTouchStart={checkDeselect}>
              {backPhotoLayers.map((rect, i) =>
                <Layer key={i} {...backPhotoLayersConfig[i]}>
                  <TransformableImage
                    shapeProps={rect}
                    imgRef={imgRef}
                    onSelect={() => {
                      setSelectId(rect.id);
                      setTextSelectedId(null);
                    }}
                    onChange={(newAttrs) => {
                      const rects = backPhotoLayers.slice();
                      rects[i] = newAttrs;
                      setBackPhotoLayers(rects);
                    }}
                  />
                </Layer>
              )}
              {frameUrl && <Frame frameUrl={frameUrl} width={frameWidth} height={frameHeight} backPhotoLayersConfig={backPhotoLayersConfig} selectedId={selectedId} hideSelectors={hideSelectors}/>}
              {frontPhotoLayers.map((rect, i) =>
                <Layer>
                  <TransformableImage
                    shapeProps={rect}
                    imgRef={imgRef}
                    isSelected={rect.id===selectedId}
                    onSelect={() => {
                      setSelectId(rect.id);
                      setTextSelectedId(null);
                    }}
                    onChange={(newAttrs) => {
                      const rects = frontPhotoLayers.slice();
                      rects[i] = newAttrs;
                      setFrontPhotoLayers(rects);
                    }}
                  />
                </Layer>
              )}
              {textLayers.map((textLayer, i) =>
                <TextLayer
                  key={i}
                  config={textLayer}
                  setConfig={(editedTextLayer)=>{
                      const newTextLayers = [...textLayers];
                      newTextLayers[i] = editedTextLayer;
                      setTextLayers(newTextLayers);
                  }}
                  onSelect={() => {
                    setSelectId(null);
                    setTextSelectedId(i);
                  }}
                />
              )}
          </Stage>
          {selectedId && textSelectedId===null && <ScaleAndRotationTransformer position={transformerPosition} imgRef={imgRef.current[selectedId]} isFrontPhoto={selectedId?(""+selectedId).indexOf("frontPhoto")>=0:false} replaceFileBtn={replaceFileBtn} removeFileBtn={removeFileBtn} setSelectId={setSelectId}/>}
          {!selectedId && textSelectedId!==null && <TextTransformer textSelectedId={textSelectedId} setTextSelectedId={setTextSelectedId} textLayers={textLayers} setTextLayers={setTextLayers}/>}
          {!selectedId && textSelectedId===null && <Menu setSelectId={setSelectId} addText={addText} addFloatingImageBtn={addFloatingImageBtn}/>}
        </>
      );
    }

  return (
    <div className={classes.centerContent} ref={parentRef}>
      {composerView}
    </div>
  );
};

export default PhotoFrame;
