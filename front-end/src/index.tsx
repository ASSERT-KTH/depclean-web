import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from 'src/reportWebVitals';
import { AppStateProvider } from 'src/AppStateContext';
import { AppMenuStateProvider } from "src/AppMenuStateContext";

ReactDOM.render(
  // <React.StrictMode>
  <AppStateProvider>
    <AppMenuStateProvider>
      <App />
    </AppMenuStateProvider>
  </AppStateProvider>,
  // </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
