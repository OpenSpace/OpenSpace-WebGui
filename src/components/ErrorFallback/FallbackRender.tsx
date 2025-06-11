import { FallbackProps } from 'react-error-boundary';
import { Alert, Button, Code, Text } from '@mantine/core';
import i18next from 'i18next';

// This function is called by the npm package react-error-boundary when an
// error is thrown. The return JSX of this function is then displayed instead
// of the JSX code that is inside the Error Boundary. The resetErrorBoundary
// prop allows us to pass in a function where we can "recover" from the thrown
// error, reset the error, and retry rendering.
export function fallbackRender({ error, resetErrorBoundary }: FallbackProps) {
  const t = (key: string) => i18next.t(`components:error-fallback.${key}`);

  return (
    <Alert variant={'light'} color={'red'} title={t('alert-title')}>
      <Text>{t('alert-text')}</Text>
      <Code block my={'md'}>
        {error.message}
      </Code>
      <Button onClick={resetErrorBoundary} mt={'md'}>
        {t('reload-button-label')}
      </Button>
    </Alert>
  );
}
