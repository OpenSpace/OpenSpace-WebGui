import { useTranslation } from 'react-i18next';
import { Code, Group, Stack, Text } from '@mantine/core';

import { CopyToClipboardButton } from '../CopyToClipboardButton/CopyToClipboardButton';

interface Props {
  uri: string;
}

function CopyUriButton({ uri }: Props) {
  const { t } = useTranslation('components', { keyPrefix: 'copy-uri-button' });

  if (!uri) {
    return <></>;
  }

  return (
    <Stack pt={'sm'}>
      <Group gap={'xs'} wrap={'nowrap'}>
        <Text size={'xs'}>{t('label')}:</Text>
        <Code>{uri}</Code>
        <CopyToClipboardButton value={uri} />
      </Group>
    </Stack>
  );
}

export default CopyUriButton;
