//Core
import React, { Suspense, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';

//Components
import Layout from './Layout';
import Presenter3d from '../../components/share3d/Presenter3d';
import ProdyctInfoCard from '../../components/share3d/ProductInfoCard';
import WelcomePopup from '../../components/share3d/WelcomePopup';

//Hooks
import { useTranslation } from 'react-i18next';
import { useGetPhotographer } from '../../services/OrderUtils';
import { useGetProducts } from '../../services/OrderUtils';

//Utils

//UI
import { makeStyles } from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
}));

const SuspenseContainer = () => {
  return (
    <>
      <CssBaseline />
      <Container maxWidth='sm'>
        <Typography
          component='div'
          style={{ backgroundColor: '#cfe8fc', height: '100vh' }}
        />
      </Container>
    </>
  );
};

const Show3dIndex = ({ match }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  //const [photographer, setPhotographer] = useState(null);

  const productsQuery = useGetProducts(match?.params?.photographerId ?? 0);

  function isLoading(query) {
    if (query.isLoading) return true;
    if (query.isFetching) return true;

    return false;
  }

  const { data } = productsQuery;

  function getProduct(products) {
    if (!products) return null;
    const lookingForProductId = match?.params?.productId ?? 0;
    const result = products.find(
      (x) => x.id == lookingForProductId && x.productType == 1
    );
    return result;
  }

  function getLayoutUrl() {
    const guid = match?.params?.guid;
    if (!guid) return null;
    const baseURL = `${process.env.REACT_APP_STORAGE_PATH}/customerorderphoto`;

    return `${baseURL}/${guid}`;
  }

  return (
    <>
      <Helmet>
        {/* TODO: this og should be translated, cover img needed */}
        <meta property='og:title' content='3d title' />
        <meta property='og:description' content='3d description' />
        <meta
          property='og:image'
          content='https://oistigmesstoragestaging.blob.core.windows.net/customerorderphoto/385210b3-6ba3-44ac-9dda-62c29f763c1b/6bd3b49d-19dd-461e-8a83-d0f56deb3989_a498aaaa-7b9e-4c1a-9e26-52634f9e6575.jpeg'
        />
        <meta property='og:type' content='website' />
      </Helmet>
      <Layout
        photographerId={match?.params?.photographerId}
        productId={match?.params?.productId}
      >
        <Backdrop className={classes.backdrop} open={isLoading(productsQuery)}>
          <CircularProgress className={classes.spinner} />
        </Backdrop>
        <Suspense fallback={<SuspenseContainer />}>
          <Presenter3d product={getProduct(data)} layerUrl={getLayoutUrl()} />
          <ProdyctInfoCard product={getProduct(data)} />
          <WelcomePopup />
        </Suspense>
      </Layout>
    </>
  );
};

export default Show3dIndex;
