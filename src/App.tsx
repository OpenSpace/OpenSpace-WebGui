import { ErrorBoundary } from 'react-error-boundary';
import { createTheme, MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';

import { fallbackRender } from './util/fallbackRenderer';
import { WindowLayout } from './windowmanagement/WindowLayout/WindowLayout';
import { WindowLayoutProvider } from './windowmanagement/WindowLayout/WindowLayoutProvider';

import 'rc-dock/dist/rc-dock-dark.css';
import '@mantine/core/styles.css';

const theme = createTheme({
  cursorType: 'pointer'
});

function App() {
  return (
    <ErrorBoundary
      fallbackRender={fallbackRender}
      onReset={() => window.location.reload()}
    >
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
