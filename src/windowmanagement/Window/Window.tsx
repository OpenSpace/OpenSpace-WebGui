import { PropsWithChildren, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useElementSize } from '@mantine/hooks';

import { fallbackRender } from '@/components/ErrorFallback/fallbackRender';
import { ScrollBox } from '@/components/ScrollBox/ScrollBox';

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
        // Sometimes these values are 0 just when opening a window which can lead to strange
        // behaviour if there are calculations depending on these values. Mitigating this with
        // a dummy value
        width: width === 0 ? 300 : width,
        height: height === 0 ? 300 : height,
        pointerEvents: { enable: enablePointerEvents, disable: disablePointerEvents }
      }}
    >
      <ScrollBox h={'100%'} ref={ref} p={'xs'}>
        <ErrorBoundary fallbackRender={fallbackRender} onReset={handleReset}>
          <Suspense fallback={null}>{children}</Suspense>
        </ErrorBoundary>
      </ScrollBox>
    </WindowSizeContext.Provider>
  );
}
export { WindowSizeContext };
