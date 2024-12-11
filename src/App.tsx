import { createTheme, MantineProvider } from '@mantine/core';

import { WindowLayout } from './windowmanagement/WindowLayout/WindowLayout';
import { WindowLayoutProvider } from './windowmanagement/WindowLayout/WindowLayoutProvider';

import 'rc-dock/dist/rc-dock-dark.css';
import '@mantine/core/styles.css';

const theme = createTheme({
  cursorType: 'pointer'
});

function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme={'dark'}>
      <WindowLayoutProvider>
        <WindowLayout />
      </WindowLayoutProvider>
    </MantineProvider>
  );
}

export default App;
