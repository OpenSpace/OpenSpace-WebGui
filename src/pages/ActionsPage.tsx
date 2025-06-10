import { ErrorBoundary } from 'react-error-boundary';
import { ModalsProvider } from '@mantine/modals';

import { fallbackRender } from '@/components/ErrorFallback/FallbackRender';
import { ConnectionErrorOverlay } from '@/windowmanagement/ConnectionErrorOverlay';
import { ActionsPanel } from '@/windowmanagement/data/LazyLoads';
import { Window } from '@/windowmanagement/Window/Window';

export function ActionsPage() {
  return (
    <ErrorBoundary
      fallbackRender={fallbackRender}
      onReset={() => window.location.reload()}
    >
      <ModalsProvider>
        <ConnectionErrorOverlay />
        <Window h={'100vh'} w={'100vw'}>
          <ActionsPanel />
        </Window>
      </ModalsProvider>
    </ErrorBoundary>
  );
}
