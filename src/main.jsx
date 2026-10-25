import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles/site.css';
import './styles/intro.css';
import './styles/cursor.css';
import './styles/services.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode><App /></React.StrictMode>
);
