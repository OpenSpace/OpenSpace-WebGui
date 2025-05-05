import { ErrorBoundary } from 'react-error-boundary';
import { ModalsProvider } from '@mantine/modals';

import { FallbackRender } from '@/components/ErrorFallback/fallbackRender';
import { WindowLayout } from '@/windowmanagement/WindowLayout/WindowLayout';
import { WindowLayoutProvider } from '@/windowmanagement/WindowLayout/WindowLayoutProvider';

export function GuiPage() {
  return (
    <ErrorBoundary
      fallbackRender={FallbackRender}
      onReset={() => window.location.reload()}
    >
      <ModalsProvider>
        <WindowLayoutProvider>
          <WindowLayout />
        </WindowLayoutProvider>
      </ModalsProvider>
    </ErrorBoundary>
  );
}
