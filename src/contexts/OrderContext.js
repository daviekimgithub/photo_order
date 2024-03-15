import React from 'react';
import { OrderReducer, INIT_STATE } from '../reducers/order/reducer';

const OrderContext = React.createContext();

function OrderProvider(props) {
  const [order, dispatch] = React.useReducer(OrderReducer, INIT_STATE);
  const value = [order, dispatch];

  return <OrderContext.Provider value={value} {...props} />;
}

function useOrder() {
  const context = React.useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within the OrderProvider component');
  }
  return context;
}

export { OrderContext, OrderProvider, useOrder };
