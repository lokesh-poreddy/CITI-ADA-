import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import RootErrorBoundary from './release/RootErrorBoundary.jsx';
import './styles.css';

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((error) => {
      // A failed service-worker registration must never block the core UI.
      console.warn('Offline shell registration unavailable:', error?.message ?? 'unknown error');
    });
  });
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RootErrorBoundary><App /></RootErrorBoundary>
  </React.StrictMode>,
);
