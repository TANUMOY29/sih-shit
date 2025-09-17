import React, { Suspense } from 'react'; // Import Suspense
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import './i18n'; // Import your i18next configuration

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Suspense fallback="Loading..."> {/* Add Suspense wrapper */}
      <App />
    </Suspense>
  </React.StrictMode>
);