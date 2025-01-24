import { PropsWithChildren } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { ScrollArea } from '@mantine/core';
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

  return (
    <WindowSizeContext.Provider
      value={{
        width: width,
        height: height
      }}
    >
      <ScrollArea h={'100%'} ref={ref}>
        <ErrorBoundary fallbackRender={fallbackRender} onReset={handleReset}>
          {children}
        </ErrorBoundary>
      </ScrollArea>
    </WindowSizeContext.Provider>
  );
}
export { WindowSizeContext };
