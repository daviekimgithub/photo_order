import React from 'react';
import { PhotographerReducer } from '../reducers/photographer/reducer';

const PhotographerContext = React.createContext();

function PhotographerProvider(props) {
  const state = {};
  const [photographer, dispatch] = React.useReducer(PhotographerReducer, state);
  const value = [photographer, dispatch];

  return <PhotographerContext.Provider value={value} {...props} />;
}

function usePhotographer() {
  const context = React.useContext(PhotographerContext);
  if (!context) {
    throw new Error(
      'usePhotographer must be used within the PhotographerProvider component'
    );
  }
  return context;
}

export { PhotographerContext, PhotographerProvider, usePhotographer };
