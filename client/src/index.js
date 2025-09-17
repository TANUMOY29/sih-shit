import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import './i18n'; // Your i18next configuration for languages
import * as serviceWorkerRegistration from './serviceWorkerRegistration'; // For the installable app (PWA)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Suspense fallback="Loading...">
      <App />
    </Suspense>
  </React.StrictMode>
);

// This line activates the "installable app" feature.
serviceWorkerRegistration.register();