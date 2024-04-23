import './index.scss';
import { HashRouter } from 'react-router-dom';
import { globalPreset } from './preset';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));

if (process.env.NODE_ENV === 'development') {
  import('@kne/modules-dev/dist/create-entry.css');
  import('@kne/modules-dev/dist/create-entry').then(module => {
    const Entry = module.default(App);
    root.render(
      <HashRouter>
        <Entry preset={globalPreset} themeToken={globalPreset.themeToken} />
      </HashRouter>
    );
  });
} else {
  root.render(
    <HashRouter>
      <App />
    </HashRouter>
  );
}
