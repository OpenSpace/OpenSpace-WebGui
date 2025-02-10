import { ErrorBoundary } from 'react-error-boundary';
import {
  ActionIcon,
  Button,
  createTheme,
  MantineProvider,
  RangeSlider,
  Slider,
  ThemeIcon,
  Tooltip
} from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';

import { fallbackRender } from './components/ErrorFallback/fallbackRender';
import { WindowLayout } from './windowmanagement/WindowLayout/WindowLayout';
import { WindowLayoutProvider } from './windowmanagement/WindowLayout/WindowLayoutProvider';

import 'rc-dock/dist/rc-dock-dark.css';
import '@mantine/core/styles.css';
import sliderClasses from './styles/Slider.module.css';

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
    RangeSlider: RangeSlider.extend({
      classNames: sliderClasses
    }),
    Slider: Slider.extend({
      classNames: sliderClasses
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
  }
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
