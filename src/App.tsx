import { createTheme, MantineProvider } from '@mantine/core';

import { WindowLayout } from './windowmanagement/WindowLayout/WindowLayout';

import 'rc-dock/dist/rc-dock-dark.css';
import '@mantine/core/styles.css';

const theme = createTheme({
  cursorType: 'pointer'
});

function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <WindowLayout></WindowLayout>
    </MantineProvider>
  );
}

export default App;
