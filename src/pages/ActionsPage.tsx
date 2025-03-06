import { fallbackRender } from '@/components/ErrorFallback/fallbackRender';
import { ConnectionErrorOverlay } from '@/windowmanagement/ConnectionErrorOverlay';
import { ActionsPanel } from '@/windowmanagement/data/LazyLoads';
import { Window } from '@/windowmanagement/Window/Window';
import { ModalsProvider } from '@mantine/modals';
import { ErrorBoundary } from 'react-error-boundary';

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
