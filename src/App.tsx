import { ErrorBoundary } from 'react-error-boundary';
import {
  ActionIcon,
  Button,
  createTheme,
  MantineProvider,
  ThemeIcon,
  Tooltip
} from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';

import { fallbackRender } from './components/ErrorFallback/fallbackRender';
import { variantColorResolver } from './util/variantColorResolver';
import { WindowLayout } from './windowmanagement/WindowLayout/WindowLayout';
import { WindowLayoutProvider } from './windowmanagement/WindowLayout/WindowLayoutProvider';

import 'rc-dock/dist/rc-dock-dark.css';
import '@mantine/core/styles.css';
import './styles/rc-dock-customization.scss';

const theme = createTheme({
  cursorType: 'pointer',
  components: {
    ActionIcon: ActionIcon.extend({
      defaultProps: {
        variant: 'default'
      }
    }),
    Button: Button.extend({
      defaultProps: {
        variant: 'default'
      }
    }),
    ThemeIcon: ThemeIcon.extend({
      defaultProps: {
        variant: 'default'
      }
    }),
    Tooltip: Tooltip.extend({
      defaultProps: {
        withArrow: true,
        transitionProps: { duration: 400, enterDelay: 400 },
        position: 'top'
      }
    })
  },
  headings: {
    sizes: {
      h1: { fontSize: '1.5rem' },
      h2: { fontSize: '1.25rem' },
      h3: { fontSize: '1.125rem' },
      h4: { fontSize: '1rem' },
      h5: { fontSize: '0.875rem' },
      h6: { fontSize: '0.75rem' }
    }
  },
  variantColorResolver
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
