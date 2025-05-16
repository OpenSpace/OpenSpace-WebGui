import { PropsWithChildren, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { BoxProps } from '@mantine/core';

import { FallbackRender } from '@/components/ErrorFallback/FallbackRender';

import { WindowSizeProvider } from './WindowSizeProvider';

export function Window({ children, ...props }: PropsWithChildren & BoxProps) {
  // TODO (ylvse 2025-01-21): This could probably be handled in a smarter way
  // Depending on panel for example, we could reload different things
  function handleReset() {
    window.location.reload();
  }

  return (
    <WindowSizeProvider {...props}>
      <ErrorBoundary fallbackRender={FallbackRender} onReset={handleReset}>
        <Suspense fallback={null}>{children}</Suspense>
      </ErrorBoundary>
    </WindowSizeProvider>
  );
}
