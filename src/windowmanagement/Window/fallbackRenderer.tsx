import { FallbackProps } from 'react-error-boundary';
import { Alert, Button, Text } from '@mantine/core';

export function fallbackRender({ error, resetErrorBoundary }: FallbackProps) {
  // Call resetErrorBoundary() to reset the error boundary and retry the render.

  return (
    <Alert variant={"light"} color={"red"} title={"Houston, we have a problem..."}>
      <Text>{error.message}</Text>
      <Button onClick={resetErrorBoundary}>Try reloading property tree</Button>
    </Alert>
  );
}
