import { ErrorBoundary } from 'react-error-boundary';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';

import { fallbackRender } from '@/components/ErrorFallback/fallbackRender';
import { WindowLayout } from '@/windowmanagement/WindowLayout/WindowLayout';
import { WindowLayoutProvider } from '@/windowmanagement/WindowLayout/WindowLayoutProvider';

export function GuiPage() {
  return (
    <ErrorBoundary
      fallbackRender={fallbackRender}
      onReset={() => window.location.reload()}
    >
      <Notifications autoClose={6000} />
      <ModalsProvider>
        <WindowLayoutProvider>
          <WindowLayout />
        </WindowLayoutProvider>
      </ModalsProvider>
    </ErrorBoundary>
  );
}
