import React from 'react';import {createRoot} from 'react-dom/client';import {BrowserRouter} from 'react-router-dom';
import App from './App';import {SiteProvider} from './lib/site';import './styles/global.css';
createRoot(document.getElementById('root')).render(<BrowserRouter><SiteProvider><App/></SiteProvider></BrowserRouter>);
