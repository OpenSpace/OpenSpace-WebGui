import { Trans, useTranslation } from 'react-i18next';
import { Button, Group, Stack, Text } from '@mantine/core';

interface Props {
  onLoadTest: () => void;
  onNewTest: () => void;
}

export function StartView({ onLoadTest, onNewTest }: Props) {
  const { t } = useTranslation('panel-testwizard');

  return (
    <Stack gap={'md'}>
      <Text>
        <Trans t={t} i18nKey={'info'} components={{ code: <code /> }} />
      </Text>
      <Group grow>
        <Button variant={'light'} onClick={onLoadTest}>
          {t('start.load-test')}
        </Button>
        <Button variant={'filled'} onClick={onNewTest}>
          {t('start.new-test')}
        </Button>
      </Group>
    </Stack>
  );
}
