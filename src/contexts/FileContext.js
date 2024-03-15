import React from 'react';
import { FileReducer, INIT_STATE } from '../reducers/file/reducer';

const FileContext = React.createContext();

function FileProvider(props) {
  const [files, dispatch] = React.useReducer(FileReducer, INIT_STATE);
  const value = [files, dispatch];

  return <FileContext.Provider value={value} {...props} />;
}

function useFiles() {
  const context = React.useContext(FileContext);
  if (!context) {
    throw new Error('useFiles must be used within the FileProvider component');
  }
  return context;
}

export { FileContext, FileProvider, useFiles };
