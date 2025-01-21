import { FallbackProps } from 'react-error-boundary';
import { Alert, Button, Code, Text } from '@mantine/core';

// Call resetErrorBoundary() to reset the error boundary and retry the render.
export function fallbackRender({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <Alert variant={'light'} color={'red'} title={'🚨 Houston, we have a problem...🚨'}>
      <Text>An error with the following message was thrown:</Text>
      <Code block my={'md'}>
        {error.message}
      </Code>
      <Button onClick={resetErrorBoundary} mt={'md'}>
        Reload page
      </Button>
    </Alert>
  );
}
