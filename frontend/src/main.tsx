import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { Router } from './routes/Router.tsx';
import { ToasterProvider } from './providers/toastProvider.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ToasterProvider />
    <Router />
  </React.StrictMode>,
);
