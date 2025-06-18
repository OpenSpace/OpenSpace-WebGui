import { StrictMode } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router';
import { MantineProvider } from '@mantine/core';

import '@/localization/config';

import { LuaApiProvider } from './api/LuaApiProvider';
import { ActionsPage } from './pages/ActionsPage';
import { GuiPage } from './pages/GuiPage';
import { RoutesPage } from './pages/RoutesPage';
import { store } from './redux/store';
import { cssVariablesResolver, theme } from './theme/mantineTheme';

import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import './App.css';
import 'rc-dock/dist/rc-dock-dark.css';

function App() {
  return (
    <Provider store={store}>
      {/* We want to place the Lua API provider outside the StrictMode as it creates a
      socket connection. Strict mode calls useEffects twice and the socket does not
      handle this well.*/}
      <LuaApiProvider>
        <StrictMode>
          <MantineProvider
            theme={theme}
            defaultColorScheme={'dark'}
            cssVariablesResolver={cssVariablesResolver}
          >
            <BrowserRouter basename={'/gui'}>
              <Routes>
                <Route index element={<GuiPage />} />
                <Route path={'routes'} element={<RoutesPage />} />
                <Route path={'actions'} element={<ActionsPage />} />
                {/* Fallback route for any undefined paths */}
                <Route path={'*'} element={<GuiPage />} />
              </Routes>
            </BrowserRouter>
          </MantineProvider>
        </StrictMode>
      </LuaApiProvider>
    </Provider>
  );
}

export default App;
