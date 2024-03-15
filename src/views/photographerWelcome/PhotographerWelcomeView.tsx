import { ComponentType, useContext, useEffect, useState } from 'react';
import { Button, Container, Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import ContactPhoneIcon from '@material-ui/icons/Phone';
import { usePhotographer } from '../../contexts/PhotographerContext';
import CircularProgress from '@material-ui/core/CircularProgress';
import Backdrop from '@material-ui/core/Backdrop';
import { useGetPhotographer } from '../../services/OrderUtils';
import { makeStyles } from '@material-ui/core/styles';
import styled from 'styled-components';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  container: {
    height: '100%',
    backgroundColor: 'transparent',
    color: 'white',
    zIndex: 1,
  },
  gridConainer: {
    height: "100%",
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gridItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '3rem',
  },
  logoContainer: {
    marginTop: '5rem',
  },
  logo: {
    width: '100%',
    maxWidth: '250px',
  },
  boldText: {
    fontWeight: 'bold',
  },
  link: {
    textDecoration: 'none',
    color: 'white',
    fontSize: '1.5rem',
    marginTop: '2rem',
    marginBottom: '2rem',
    textAlign: 'center',
  },
  callButton: {
    backgroundColor: '#white',
    width: 'fit-content',
    color: '#4556ac',
    padding: '0.5rem',
    '&:hover': {
      backgroundColor: '#4556ac',
      color: '#ffffff',
    },
  },
  callIcon: {
    color: '#4556ac',
    paddingRight: '0.5rem',
    '&:hover': {
      backgroundColor: '#4556ac',
      color: '#ffffff',
    },
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  spinner: {
    color: '#743c6e',
  },
  welcomeBackground: {
    position: 'absolute',
    left: '0',
    top: '0',
    height: '100%',
    width: '100%',
    backgroundColor: "#5F9EA0"
  }
}));

function isLoading(query: any) {
  if (query.isLoading) return true;
  if (query.isFetching) return true;

  return false;
}

const PhotographerWelcomeView: ComponentType<any> = ({ userId }) => {
  const classes = useStyles();

  const { authUser } = useContext(AuthContext);
  const history = useHistory();

  const photographerQuery = useGetPhotographer(userId ?? 0);

  const [photographer, dispatch] = usePhotographer();
  const { data } = photographerQuery;
  
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    if (data) {
      dispatch({ type: 'SET_INFO', data: data });
      setIsDataLoaded(true);
    }
  }, [data, dispatch]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (isDataLoaded) {
      timeoutId = setTimeout(() => {
        history.push(`/photographer/${authUser.id}`);
      }, 3000);
    }

    return () => clearTimeout(timeoutId);
  }, [authUser.id, isDataLoaded, history]);

  return (
    <>
      <S.View>
        <div className={classes.welcomeBackground} />
        <Container maxWidth="md" className={classes.container}>
          <Grid
            container
            spacing={3}
            className={classes.gridConainer}
            direction='column'
          >
              <Grid item className={classes.logoContainer}>
                {
                  photographer.logoUrl
                    ? (
                      <img
                        src={photographer.logoUrl}
                        alt='company logo'
                        className={classes.logo}
                      />
                    ) : (
                      <CircularProgress className={classes.spinner} /> 
                    )
                }
              </Grid>
              <Grid item className={classes.gridItem}>
                <Typography variant="h5" align="center" gutterBottom className={classes.boldText}>
                  {photographer.companyName}
                </Typography>
                <Typography variant="h5" align="center" gutterBottom>
                  {photographer.street}
                </Typography>
                <a href={photographer.website} className={classes.link}>
                  {photographer.website}
                </a>
                <Button 
                  className={classes.callButton}
                  variant="contained"
                  onClick={() => {window.location.href = `tel:${photographer.phone}`}}
                >
                  <ContactPhoneIcon className={classes.callIcon} />
                  Call Us
                </Button>
            </Grid>
          </Grid>
        </Container>
      </S.View>
    </>
  );
};

export default PhotographerWelcomeView;

const S = {
  View: styled.div`
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  `,
};
