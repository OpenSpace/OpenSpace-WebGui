import { FallbackProps } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';
import { Alert, Button, Code, Text } from '@mantine/core';

// This function is called by the npm package react-error-boundary when an
// error is thrown. The return JSX of this function is then displayed instead
// of the JSX code that is inside the Error Boundary. The resetErrorBoundary
// prop allows us to pass in a function where we can "recover" from the thrown
// error, reset the error, and retry rendering.
export function FallbackRender({ error, resetErrorBoundary }: FallbackProps) {
  const { t } = useTranslation('components', { keyPrefix: 'error-fallback' });

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
