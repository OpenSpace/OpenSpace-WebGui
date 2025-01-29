import { PropsWithChildren } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Box } from '@mantine/core';
import { useElementSize } from '@mantine/hooks';

import { fallbackRender } from '@/components/ErrorFallback/fallbackRender';

import { WindowSizeContext } from './WindowSizeContext';

export function Window({ children }: PropsWithChildren) {
  const { ref, width, height } = useElementSize();

  // TODO (ylvse 2025-01-21): This could probably be handled in a smarter way
  // Depending on panel for example, we could reload different things
  function handleReset() {
    window.location.reload();
  }

  function disablePointerEvents(): void {
    if (!ref.current) {
      return;
    }
    ref.current.style.pointerEvents = 'none';
    ref.current.style.userSelect = 'none';
  }

  function enablePointerEvents(): void {
    if (!ref.current) {
      return;
    }
    ref.current.style.removeProperty('user-select');
    ref.current.style.removeProperty('pointer-events');
  }

  return (
    <WindowSizeContext.Provider
      value={{
        width: width,
        height: height,
        pointerEvents: { enable: enablePointerEvents, disable: disablePointerEvents }
      }}
    >
      <Box h={'100%'} ref={ref}>
        <ErrorBoundary fallbackRender={fallbackRender} onReset={handleReset}>
          {children}
        </ErrorBoundary>
      </Box>
    </WindowSizeContext.Provider>
  );
}
export { WindowSizeContext };
