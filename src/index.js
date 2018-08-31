import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter as Router, Route, Link, Switch, NavLink, Redirect } from "react-router-dom";

import './index.css';
import App from './App';
import Store from './store';

ReactDOM.render(
    <Provider store={Store}>
        <Router>
            <App />
        </Router>
    </Provider>
, document.getElementById('root'));

registerServiceWorker();
