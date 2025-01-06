import React, { Component } from 'react';
import ReactDOM from 'react-dom/client'
import App from './App';
import { configureStore } from './store';
import { Provider } from 'react-redux';
import "./index.css";
import { SnackbarProvider } from 'notistack';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={configureStore()}>
    <SnackbarProvider maxSnack={3} anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}>
      <App />
    </SnackbarProvider>
  </Provider>
)