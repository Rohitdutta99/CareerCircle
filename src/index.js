import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import store from "./store";
import { initializeApp } from 'firebase/app'; // Import initializeApp function
import firebaseConfig from './firebaseConfig'; // Import your Firebase config


initializeApp(firebaseConfig);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App/>
    </Provider> 
  </React.StrictMode>,
  document.getElementById("root")
);
