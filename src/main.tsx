import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import { LuaApiProvider } from './api/LuaApiProvider';
import { store } from './redux/store';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <LuaApiProvider>
      <StrictMode>
        <App />
      </StrictMode>
    </LuaApiProvider>
  </Provider>
);
