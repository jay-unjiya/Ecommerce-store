import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import store from './store/store';
import './index.css';
import App from './App'; // Import the App component

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <Router>
      <App /> {/* Render the App component */}
    </Router>
  </Provider>
);
