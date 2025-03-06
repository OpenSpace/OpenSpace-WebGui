import { fallbackRender } from '@/components/ErrorFallback/fallbackRender';
import { WindowLayout } from '@/windowmanagement/WindowLayout/WindowLayout';
import { WindowLayoutProvider } from '@/windowmanagement/WindowLayout/WindowLayoutProvider';
import { ModalsProvider } from '@mantine/modals';
import { ErrorBoundary } from 'react-error-boundary';

export function GuiPage() {
  return (
    <ErrorBoundary
      fallbackRender={fallbackRender}
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
