//Core
import React, { useLayoutEffect, useState } from 'react';

//Components

//Hooks
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useGetBanners } from '../../services/OrderUtils';

//Utils
import { isMobile } from 'react-device-detect';

//UI
import { makeStyles, useTheme } from '@material-ui/core/styles';
import MobileStepper from '@material-ui/core/MobileStepper';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: '100%',
    flexGrow: 1,
    marginBottom: '12px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    height: 50,
    paddingLeft: '6px',
    // backgroundColor: theme.palette.background.default,
  },
  img: {
    maxHeight: '480px',
    display: 'block',
    overflow: 'hidden',
    width: '100%',
    objectFit: 'cover !important',
    cursor: 'pointer',
  },
}));

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const BanerSlider = ({ photographerId }) => {
  const classes = useStyles();
  const theme = useTheme();
  const { t } = useTranslation();
  const history = useHistory();

  const [activeStep, setActiveStep] = React.useState(0);
  const [banners, setBanners] = useState([]);
  const [maxSteps, setMaxSteps] = useState(banners.length ?? 0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  const handleClickBaner = (step) => {
    if (!step) return;

    if (step.productId) {
      history.push(
        `/photographer/${step.photographerId}/products/${step.productId}`
      );
    } else if (step.externalUrl) {
      window.open(step.externalUrl, '_blank', 'noopener,noreferrer');
    } else {
      return null;
    }
  };

  const bannersQuery = useGetBanners(photographerId ?? 0);
  const { data } = bannersQuery;

  useLayoutEffect(() => {
    if (data) {
      setBanners(data);
      setMaxSteps(data.length);
    }
  }, [data]);

  function showBanner(list) {
    if (!list) return false;
    return list.length > 0;
  }

  return (
    <>
      {showBanner(banners) && (
        <div className={classes.root}>
          <Paper square elevation={0} className={classes.header}>
            <Typography>{banners[activeStep].buttonText}</Typography>
          </Paper>
          <AutoPlaySwipeableViews
            axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
            index={activeStep}
            onChangeIndex={handleStepChange}
            enableMouseEvents
            interval={6000}
          >
            {banners.map((step, index) => (
              <div key={step.buttonText}>
                {Math.abs(activeStep - index) <= maxSteps ? (
                  <img
                    className={classes.img}
                    src={isMobile ? step.mobileImageUrl : step.imageUrl}
                    alt={step.buttonText}
                    onClick={() => handleClickBaner(step)}
                  />
                ) : null}
              </div>
            ))}
          </AutoPlaySwipeableViews>
          <MobileStepper
            steps={maxSteps}
            position='static'
            variant='text'
            activeStep={activeStep}
            nextButton={
              <Button
                size='small'
                onClick={handleNext}
                disabled={activeStep === maxSteps - 1}
              >
                Next
                {theme.direction === 'rtl' ? (
                  <KeyboardArrowLeft />
                ) : (
                  <KeyboardArrowRight />
                )}
              </Button>
            }
            backButton={
              <Button
                size='small'
                onClick={handleBack}
                disabled={activeStep === 0}
              >
                {theme.direction === 'rtl' ? (
                  <KeyboardArrowRight />
                ) : (
                  <KeyboardArrowLeft />
                )}
                Back
              </Button>
            }
          />
        </div>
      )}
    </>
  );
};

export default BanerSlider;
