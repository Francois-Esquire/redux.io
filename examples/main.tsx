import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { App } from './App.js';
import { createDemoStore } from './store.js';
import './style.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={createDemoStore()}>
      <App />
    </Provider>
  </StrictMode>,
);
