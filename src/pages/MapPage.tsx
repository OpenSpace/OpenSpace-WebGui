import { ErrorBoundary } from 'react-error-boundary';
import { ModalsProvider } from '@mantine/modals';

import { DynamicMap } from '@/components/DynamicMap/DynamicMap';
import { fallbackRender } from '@/components/ErrorFallback/FallbackRender';
import { ConnectionErrorOverlay } from '@/windowmanagement/ConnectionErrorOverlay';
import { Window } from '@/windowmanagement/Window/Window';

export function MapPage() {
  return (
    <ErrorBoundary
      fallbackRender={fallbackRender}
      onReset={() => window.location.reload()}
    >
      <ModalsProvider>
        <ConnectionErrorOverlay />
        <Window h={'100vh'} w={'100vw'}>
          <DynamicMap iconSize={55} coneHeight={55} coneWidth={70} />
        </Window>
      </ModalsProvider>
    </ErrorBoundary>
  );
}
