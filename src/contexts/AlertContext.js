import React from 'react';
import { createPortal } from 'react-dom';
import Alert from '../components/core/Alerts';

import { AlertReducer } from '../reducers/alert/reducer';

//this allows you to set an alert in a snackbar at the bottom of the page anywhere
/*
alert template :

  alertDispatch({
                    type: ADD,
                    payload: {
                        content: {header: '*the header* - string' message: '*the message* - string' },
                        type: "*type of alert* - string (error, warning, info, success, confirm)",
                        action:{what to do on "ok" click on a confirm}
                    }
                })

*/

const AlertContext = React.createContext();

function AlertProvider(props) {
  const state = [];
  const [alerts, dispatch] = React.useReducer(AlertReducer, state);
  const value = [alerts, dispatch];

  return (
    <AlertContext.Provider value={value} {...props}>
      {props.children}
      {createPortal(<Alert alert={alerts} />, document.body)}
    </AlertContext.Provider>
  );
}

function useAlerts() {
  const context = React.useContext(AlertContext);
  if (!context) {
    throw new Error(
      'useAlerts must be used within the AlertProvider component'
    );
  }
  return context;
}

export { AlertContext, AlertProvider, useAlerts };
