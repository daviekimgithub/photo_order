//Core
import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

//Components
import { PhotographerProvider } from '../contexts/PhotographerContext';
import { OrderProvider } from '../contexts/OrderContext';
import { AlertProvider } from '../contexts/AlertContext';

//Hooks
import { useTranslation } from 'react-i18next';

//Utils

//UI
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      useErrorBoundary: false,
      refetchOnWindowFocus: false,
      staleTime: 60 * 1000 * 10, //10 minutes
      retry(failureCount, error) {
        if (error.status === 404) return false;
        else if (failureCount < 2) return true;
        else return false;
      },
    },
  },
});

const GlobalProviders = ({ children }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <AlertProvider>
      <QueryClientProvider client={queryClient}>
        <PhotographerProvider>
          <OrderProvider>{children}</OrderProvider>
        </PhotographerProvider>
      </QueryClientProvider>
    </AlertProvider>
  );
};

export default GlobalProviders;
