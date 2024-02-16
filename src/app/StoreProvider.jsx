'use client';
import { persistor, reduxStore } from '@/lib';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

export default function StoreProvider({ children }) {
  return (
    <Provider store={reduxStore}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
