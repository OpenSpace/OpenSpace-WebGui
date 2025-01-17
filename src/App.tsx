import { createTheme, MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';

import { WindowLayout } from './windowmanagement/WindowLayout/WindowLayout';
import { WindowLayoutProvider } from './windowmanagement/WindowLayout/WindowLayoutProvider';

import 'rc-dock/dist/rc-dock-dark.css';
import '@mantine/core/styles.css';
import { ErrorBoundary } from 'react-error-boundary';
import { fallbackRender } from './util/fallbackRenderer';

const theme = createTheme({
  cursorType: 'pointer'
});

function App() {
  return (
    <ErrorBoundary fallbackRender={fallbackRender}>
      <MantineProvider theme={theme} defaultColorScheme={'dark'}>
        <ModalsProvider>
          <WindowLayoutProvider>
            <WindowLayout />
          </WindowLayoutProvider>
        </ModalsProvider>
      </MantineProvider>
    </ErrorBoundary>
  );
}

export default App;
