import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';

import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { AuthProvider } from './context/authcontext'; // Import AuthProvider
import { TranslationProvider } from './context/TranslationContext'; 
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <TranslationProvider>
        <App />
      </TranslationProvider>
    </AuthProvider>
  </React.StrictMode>
);

serviceWorkerRegistration.register();
