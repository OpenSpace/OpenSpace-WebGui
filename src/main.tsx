import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router';
import { MantineProvider } from '@mantine/core';

import { LuaApiProvider } from './api/LuaApiProvider';
import { ActionsPage } from './pages/ActionsPage.tsx';
import { RoutesPage } from './pages/RoutesPage.tsx';
import { store } from './redux/store';
import { theme } from './theme/mantineTheme';
import App from './App.tsx';

import '@mantine/core/styles.css';

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    {/* We want to place the lua api provider here as it creates a socket connection.
     We want this to be outside of the strict mode, which calls useEffects twice. 
     The socket doesn't handle this well.*/}
    <LuaApiProvider>
      <StrictMode>
        <MantineProvider theme={theme} defaultColorScheme={'dark'}>
          <BrowserRouter>
            <Routes>
              <Route index element={<RoutesPage />} />
              <Route path={'/frontend'} element={<App />} />
              <Route path={'/actions'} element={<ActionsPage />} />
            </Routes>
          </BrowserRouter>
        </MantineProvider>
      </StrictMode>
    </LuaApiProvider>
  </Provider>
);
