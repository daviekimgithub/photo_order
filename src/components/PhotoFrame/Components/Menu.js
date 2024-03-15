import React, {useEffect, useState} from 'react';
import { useTranslation } from 'react-i18next';

// UI
import RoundButton from './../../core/RoundButton';
import Box from '@material-ui/core/Box';
import WallpaperIcon from '@material-ui/icons/Wallpaper';
import FormatShapesIcon from '@material-ui/icons/FormatShapes';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';


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
    [theme.breakpoints.down(350)]: {
      height: "130px"
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
  menuBtn: {
    display: "inline-grid"
  },
  centerContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

const Menu = ({setSelectId, addText, addFloatingImageBtn}) =>{
  const { t } = useTranslation();
  const classes = useStyles();

  return(
    <div className={classes.scaleAndRotationPlaceholder}>
        <div>
          <div className={classes.menuBtn}>
            {addFloatingImageBtn}
          </div>
          <div className={classes.menuBtn}>
            <RoundButton
              size='small'
              onClick={()=>setSelectId(-1)}
              disabled={false}
              className={
                true ? classes.visible : classes.hidden
              }
            >
              <Box className={classes.centerContent}>
                <WallpaperIcon />
                <span>{t('Edit Photo')}</span>
              </Box>
            </RoundButton>
          </div>
          <div className={classes.menuBtn}>
            <RoundButton
              size='small'
              onClick={addText}
              disabled={false}
              className={
                true ? classes.visible : classes.hidden
              }
            >
              <Box className={classes.centerContent}>
                <FormatShapesIcon />
                <span>{t('Add Text')}</span>
              </Box>
            </RoundButton>
          </div>
        </div>
    </div>
  )
}

// <div className={classes.menuBtn}>
//   <RoundButton
//     size='small'
//     onClick={() => {}}
//     disabled={true}
//     className={
//       true ? classes.visible : classes.hidden
//     }
//   >
//     <Box className={classes.centerContent}>
//       <FormatShapesIcon />
//       <span>{t('Add Shape')}</span>
//     </Box>
//   </RoundButton>
// </div>

export default Menu;
