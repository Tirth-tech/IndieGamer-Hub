import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import App from './App.jsx';
import './index.css';
import { ToastProvider } from './components/Toast.jsx';

// Set API base URL: VITE_API_URL env var > localhost for dev > production Render URL
const PRODUCTION_API = 'https://indiegamer-backend.onrender.com';

if (import.meta.env.VITE_API_URL) {
  axios.defaults.baseURL = import.meta.env.VITE_API_URL;
} else if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
  axios.defaults.baseURL = 'http://localhost:5000';
} else {
  // Production: Vercel frontend → Render backend
  axios.defaults.baseURL = PRODUCTION_API;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ToastProvider>
      <App />
    </ToastProvider>
  </React.StrictMode>,
);
