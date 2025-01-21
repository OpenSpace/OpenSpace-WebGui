import { FallbackProps } from 'react-error-boundary';
import { Alert, Button, Code, Text } from '@mantine/core';

// This function is called by the npm package react-error-boundary when an
// error is thrown. The return JSX of this function is then displayed instead
// of the JSX code that is inside the Error Boundary. The resetErrorBoundary
// prop allows us to pass in a function where we can "recover" from the thrown
// error, reset the error, and retry rendering.
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
