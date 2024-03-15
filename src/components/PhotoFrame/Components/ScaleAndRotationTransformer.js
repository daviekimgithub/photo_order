import React, {useEffect, useState} from 'react';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Btn from '../Atoms/Btn';
import UndoIcon from '@material-ui/icons/Undo';
import AspectRatioIcon from '@material-ui/icons/AspectRatio';
import RotateRightIcon from '@material-ui/icons/RotateRight';


const useStyles = makeStyles((theme) => ({
  scaleAndRotationPlaceholder: {
    marginTop:"10px",
    width: "100%",
    height: "55px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    [theme.breakpoints.down(500)]: {
      height: "110px"
    },
    [theme.breakpoints.down(400)]: {
      height: "150px"
    }
  },
  resizeLabel:{
    margin: "auto",
    textTransform: "uppercase",
    fontSize: "0.8125rem",
    color: "rgba(0, 0, 0, 0.87)",
    fontFamily: "Nunito,sans-serif",
    fontWeight: "500",
    lineHeight: "1.75"
  },
  resizeBtn: {
    display: "inline-grid"
  },
  changeFileBtn: {
    display: "inline-grid"
  }
}));

const ScaleAndRotationTransformer = ({initPos, imgRef, isFrontPhoto, replaceFileBtn, removeFileBtn, setSelectId}) =>{
  const { t } = useTranslation();
  const classes = useStyles();
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState(null);
  const [showRotationBtn, setShowRotationBtn] = useState(false);
  const [showResizeBtn, setShowResizeBtn] = useState(false);

  useEffect(()=>{
    if(initPos){
      const x = initPos.x + initPos.width/2;
      const y = initPos.y + initPos.height/2;
      setPosition({
        x: x + 'px',
        y: y + 'px'
      })
    }
    if(imgRef){
      const s = imgRef.attrs.scaleX || 1;
      const r = imgRef.attrs.rotation || 0;
      setScale((s-1)*10);
      setRotation(r);
    }
  },[position])

  useEffect(()=>{
    if(imgRef){
      imgRef.setAttrs({
        scaleX: 1 + scale/10,
        scaleY: 1 + scale/10,
        rotation: rotation
      })
    }
  },[scale,rotation])

  useEffect(()=>{
    if(imgRef){
      setScale((imgRef.attrs.scaleX-1)*10 || 0);
      setRotation(imgRef.attrs.rotation || 0);
    }
  },[imgRef])


  const rotationBtn = (
    <>
      { !showRotationBtn ?
        <Btn icon={<RotateRightIcon />} text ={t('Rotation')} fun={()=>{setShowRotationBtn(true); setShowResizeBtn(false)}} />:
        <div className={classes.resizeBtn}>
          <input
            type="range" min="-180" max="180"
            value={rotation}
            onChange={(e)=>{
              const s = parseInt(e.target.value);
              setRotation(s)
          }} />
          <Typography className={classes.resizeLabel} gutterBottom>
            {t('Rotation')}
          </Typography>
        </div>
      }
    </>
  )

  const resizeBtn = (
    <>
      { !showResizeBtn ?
        <Btn icon={<AspectRatioIcon />} text ={t('Resize')} fun={()=>{setShowRotationBtn(false); setShowResizeBtn(true)}} />:
        <div className={classes.resizeBtn}>
          <input
            type="range" min={isFrontPhoto ? "-5" : "1"} max="10"
            value={scale}
            onChange={(e)=>{
              const s = parseInt(e.target.value);
              setScale(s)
          }} />
          <Typography className={classes.resizeLabel} gutterBottom>
            {t('Resize')}
          </Typography>
        </div>
      }
    </>
  )

  const buttons=(
    <>
      {!showResizeBtn && rotationBtn}
      {!showRotationBtn && resizeBtn}
      {showRotationBtn && showResizeBtn &&
        <div className={classes.changeFileBtn}>
          {replaceFileBtn}
        </div>
      }
      {!showRotationBtn && !showResizeBtn && isFrontPhoto && <div className={classes.changeFileBtn}>
        {removeFileBtn}
      </div>}
      {(showRotationBtn || showResizeBtn) && <Btn icon={<UndoIcon />} text ={t('Back')} fun={()=>{setShowRotationBtn(false); setShowResizeBtn(false)}} />}
    </>
  )

  const noPhotoSelected=(
    <div className={classes.resizeBtn}>
      <Typography className={classes.resizeLabel} gutterBottom>
        {t('Select image by clicking it')}
      </Typography>
    </div>
  )

  return(
    <div className={classes.scaleAndRotationPlaceholder}>
        <div>
          {imgRef && buttons}
          {!imgRef && noPhotoSelected}
          {!showRotationBtn && !showResizeBtn && <Btn icon={<UndoIcon />} text ={t('Back')} fun={()=>setSelectId(null)} />}
        </div>
    </div>
  )
}


export default ScaleAndRotationTransformer;
