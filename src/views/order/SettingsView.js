import React, { useEffect, useState, useContext } from 'react';
import { Button, Container, Typography, Snackbar, Collapse, Divider, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../../contexts/AuthContext';
import DatabaseService from '../../services/TokenService';
import CircularProgress from '@material-ui/core/CircularProgress';
import MuiAlert from '@material-ui/lab/Alert';
import { setLocalStorageSettings } from '../../services/SettingsService';
import PlusIcon from '@material-ui/icons/Add';
import MinusIcon from '@material-ui/icons/Remove';

import styled from 'styled-components';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%'
  },
  welcomeBackground: {
    position: 'absolute',
    left: '0',
    top: '0',
    height: '100%',
    width: '100%',
    backgroundColor: "#5F9EA0"
  },
  settingsContainer: {
    color: '#ffffff',
    zIndex: 2,
  },
  titleText: {
    fontSize: '2rem',
  },
  divider: {
    backgroundColor: "#ffffff",
    marginBottom: '3rem', 
  },
  subtitleBlock: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '1rem',
  },
  subtitleMainText: {
    fontSize: '1.2rem',
    fontWeight: "700",
    paddingRight: '1rem'
  },
  subtitleText: {
    fontSize: '1.2rem',
    borderRadius: '5px',
    border: 'none',
    padding: '10px',
    marginTop: '5px',
  },
  tokenBlock: {
    fontSize: '1.2rem',
    display: 'flex',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  token: {
    marginTop: '0'
  },
  formButton: {
    padding: '1rem',
    border: '2px solid white',
    backgroundColor: '#5F9EA0',
    color: '#fff',
    marginTop: '1rem',
    width: '100%',
    fontWeight: '800'
  },
  collapseButton: {
    color: '#5F9EA0',
    backgroundColor: '#fff',
    borderRadius: '50%',
    height: '4rem',
    marginBottom: '2rem',
    marginRight: '1rem',
    '&:hover': {
      backgroundColor: '#fff',
    }
  },
  collapseWrap: {
    marginBottom: '1rem',
  },
  collapseBox: {
    display: 'flex'
  }
}));

const S = {
  View: styled.div`
    display: flex;
    min-height: 85vh;
    padding-top: 16px;
    height: 100%;
    position: relative;
    justify-content: center;
  `,
};

const SettingsView = () => {
  const classes = useStyles();
  const { authUser, setAuthUser } = useContext(AuthContext);
  const { t } = useTranslation();

  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);
  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
  const [userData, setUserData] = useState({
    firstName: authUser?.firstName || "",
    lastName: authUser?.lastName || "",
    phone: authUser?.phone || "",
    email: authUser?.email || "",
    address: authUser?.street || "",
    zipCode: authUser?.zipCode || "",
    city: authUser?.city || "",
    country: authUser?.country || ""
  });
  const [isUserInfoOpen, setIsUserInfoOpen] = useState(false);
  const [isDeliveryInfoOpen, setIsDeliveryInfoOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingForm, setIsLoadingForm] = useState(false);
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (
          !authUser?.firstName || 
          !authUser?.phone || 
          !authUser?.street || 
          !authUser?.email ||
          !authUser?.zipCode ||
          !authUser?.city ||
          !authUser?.country
        ) {
          const data = await DatabaseService.getSettingsInfo();
          setUserData({
            firstName: authUser?.firstName && data[2]?.Value,
            lastName: authUser?.lastName || "",
            phone: authUser?.phone && data[3]?.Value,
            email: authUser?.email && data[1]?.Value,
            address: authUser?.street && data[0]?.Value,
            zipCode: authUser?.zipCode,
            city: authUser?.city,
            country: authUser?.country
          });
        }
      } catch (error) {
        console.error('Error checking old settings data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [authUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    try {
      setIsLoadingForm(true);
      const updatedUserData = {
        ...userData,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone,
        email: userData.email,
        address: userData.address,
        zipCode: userData.zipCode,
        city: userData.city,
        country: userData.country
      };

      await setLocalStorageSettings(updatedUserData);
      setAuthUser({
        ...authUser,
        firstName: updatedUserData.firstName,
        lastName: updatedUserData.lastName,
        phone: updatedUserData.phone,
        email: updatedUserData.email,
        street: updatedUserData.address,
        zipCode: userData.zipCode,
        city: userData.city,
        country: userData.country
      });
      setSuccessSnackbarOpen(true);
    } catch (e) {
      setErrorSnackbarOpen(true);
    } finally {
      setIsLoadingForm(false);
    }
  };

  const handleSnackbarClose = () => {
    setErrorSnackbarOpen(false);
    setSuccessSnackbarOpen(false);
  };

  if (isLoading) {
    return (
      <div 
        style={{ 
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </div>
    )
  }

  return (
    <S.View>
      <div className={classes.welcomeBackground} />
      <Container maxWidth="md" className={classes.settingsContainer}>
        <Typography className={classes.titleText}>
          Settings
        </Typography>
        <Divider className={classes.divider} />
        <Typography className={classes.tokenBlock}>
          <Typography className={classes.subtitleMainText}>Token:</Typography> 
          <Typography className={`${classes.subtitleText} ${classes.token}`}>{authUser?.mobileToken}</Typography>
        </Typography>
        <form onSubmit={handleSaveChanges} className={classes.welcomeForm}>
          <Box className={classes.collapseBox}>
            <Button className={classes.collapseButton} onClick={() => setIsUserInfoOpen(!isUserInfoOpen)}>
              {
                !isUserInfoOpen
                  ? <PlusIcon />
                  : <MinusIcon />
              }
            </Button>
            <h2>User Info</h2>
          </Box>
          <Collapse in={isUserInfoOpen} className={classes.collapseWrap}>
            <Typography className={classes.subtitleBlock}>
              <Typography className={classes.subtitleMainText}>First name:</Typography> 
              <input 
                className={classes.subtitleText} 
                type="text" 
                name="firstName" 
                value={userData.firstName} 
                onChange={handleInputChange} 
              />
            </Typography>
            <Typography className={classes.subtitleBlock}>
              <Typography className={classes.subtitleMainText}>Last name:</Typography> 
              <input 
                className={classes.subtitleText} 
                type="text" 
                name="lastName" 
                value={userData.lastName} 
                onChange={handleInputChange} 
              />
            </Typography>
            <Typography className={classes.subtitleBlock}>
              <Typography className={classes.subtitleMainText}>Phone number:</Typography> 
              <input 
                className={classes.subtitleText} 
                type="number" 
                name="phone" 
                value={userData.phone} 
                onChange={handleInputChange} 
              />
            </Typography>
            <Typography className={classes.subtitleBlock}>
              <Typography className={classes.subtitleMainText}>Email:</Typography> 
              <input 
                className={classes.subtitleText} 
                type="email" 
                name="email" 
                value={userData.email} 
                onChange={handleInputChange} 
              />
            </Typography>
          </Collapse>
          
          <Box className={classes.collapseBox}>
            <Button className={classes.collapseButton} onClick={() => setIsDeliveryInfoOpen(!isDeliveryInfoOpen)}>
              {
                !isDeliveryInfoOpen
                  ? <PlusIcon />
                  : <MinusIcon />
              }
            </Button>
            <h2>Delivery Info</h2>
          </Box>

          <Collapse in={isDeliveryInfoOpen}>
            <Typography className={classes.subtitleBlock}>
              <Typography className={classes.subtitleMainText}>Street Address:</Typography> 
              <input 
                className={classes.subtitleText} 
                type="text" 
                name="address" 
                value={userData.address} 
                onChange={handleInputChange} 
              />
            </Typography>
            <Typography className={classes.subtitleBlock}>
              <Typography className={classes.subtitleMainText}>ZIP Code:</Typography> 
              <input 
                className={classes.subtitleText} 
                type="number" 
                name="zipCode" 
                value={userData.zipCode} 
                onChange={handleInputChange} 
              />
            </Typography>
            <Typography className={classes.subtitleBlock}>
              <Typography className={classes.subtitleMainText}>City:</Typography> 
              <input 
                className={classes.subtitleText} 
                type="text" 
                name="city" 
                value={userData.city} 
                onChange={handleInputChange} 
              />
            </Typography>
            <Typography className={classes.subtitleBlock}>
              <Typography className={classes.subtitleMainText}>Country:</Typography> 
              <input 
                className={classes.subtitleText} 
                type="text" 
                name="country" 
                value={userData.country} 
                onChange={handleInputChange} 
              />
            </Typography>
          </Collapse>
          
          <Button
            type="submit"
            disabled={isLoadingForm}
            className={classes.formButton}
          >
            {isLoadingForm 
              ? 
                <div 
                  style={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: 'white'
                  }}
                >
                  <CircularProgress color='#5F9EA0' size={25} />
                </div> 
              : 'Save Changes'
            }
          </Button>
        </form>
        <Snackbar
          open={errorSnackbarOpen}
          autoHideDuration={4000}
          onClose={handleSnackbarClose}
        >
          <Alert severity="error">
            Internal server error. Please try again.
          </Alert>
        </Snackbar>
        <Snackbar
          open={successSnackbarOpen}
          autoHideDuration={4000}
          onClose={handleSnackbarClose}
        >
          <Alert severity="success">
            Data successfully saved.
          </Alert>
        </Snackbar>
      </Container>
    </S.View>
  );
};

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default SettingsView;
