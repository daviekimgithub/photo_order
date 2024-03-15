//Core
import React, { useState, Suspense, useContext } from 'react'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'

//Components

//Hooks
import { useTranslation } from 'react-i18next';

//Utils

//UI
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import PrivateRoute from './PrivateRoute'
import AuthProvider, { AuthContext } from '../../contexts/AuthContext'
import LoginRoute from './LoginRoute'

//Views
const ViewPhotographer = React.lazy(() =>
  import(/* webpackChunkName: "views-photographer" */ '../../views/order')
);

const View3dPresenter = React.lazy(() =>
  import(/* webpackChunkName: "views-3dPresenter" */ '../../views/show3d')
);

const View404 = React.lazy(() =>
  import(/* webpackChunkName: "views-404" */ '../../views/NotFoundView')
);

const CookiePage = React.lazy(() =>
  import(/* webpackChunkName: "views-404" */ '../../views/cookie')
);

const WelcomeView = React.lazy(() =>
  import(/* webpackChunkName: "views-404" */ '../../views/welcome/WelcomeView.tsx')
);

const PhotographerWelcomeView = React.lazy(() => 
  import(/* webpackChunkName: "views-404" */ '../../views/photographerWelcome/PhotographerWelcomeView')
);


const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
}));

const SuspenseContainer = () => {
  return (
    <>
      <CssBaseline />

      <Grid
        container
        style={{ height: '100vh', paddingTop: '75px' }}
        direction='column'
        alignItems='center'
        justifyContent='center'
      >
        <Grid item xs>
          <CircularProgress />
          <br />
        </Grid>
      </Grid>
    </>
  );
};

const Router = (props) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <Suspense fallback={<SuspenseContainer />}>
      <BrowserRouter>
        <AuthProvider>
          <Switch>
            <Route
              exact
              path='/cookie'
              render={(props) => <CookiePage {...props} />}
            />
            <LoginRoute exact path="/login" />
            <PrivateRoute
              exact
              path='/share3d/:photographerId/:productId/:guid'
              component={View3dPresenter}
              />
            <PrivateRoute
              path='/photographer/:id'
              component={ViewPhotographer}/>
            <PrivateRoute
              path='/:id'
              component={ViewPhotographer}
            />
            <PrivateRoute
              path='/required-screen'
              component={PhotographerWelcomeView}
            />
            <Route path="/" render={(props) => <Redirect to="/login" />} />
          </Switch>
        </AuthProvider>
      </BrowserRouter>
    </Suspense>
  );
};

export default Router;
