import { PropsWithChildren, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { fallbackRender } from '@/components/ErrorFallback/fallbackRender';

import { WindowSizeProvider } from './WindowSizeProvider';
import { BoxProps } from '@mantine/core';

export function Window({ children, ...props }: PropsWithChildren & BoxProps) {
  // TODO (ylvse 2025-01-21): This could probably be handled in a smarter way
  // Depending on panel for example, we could reload different things
  function handleReset() {
    window.location.reload();
  }

  return (
    <WindowSizeProvider {...props}>
      <ErrorBoundary fallbackRender={fallbackRender} onReset={handleReset}>
        <Suspense fallback={null}>{children}</Suspense>
      </ErrorBoundary>
    </WindowSizeProvider>
  );
}
