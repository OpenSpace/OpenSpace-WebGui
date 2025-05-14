import { useTranslation } from 'react-i18next';
import { Code, Group } from '@mantine/core';

import { CopyToClipboardButton } from '../CopyToClipboardButton/CopyToClipboardButton';

interface Props {
  uri: string;
}

function CopyUriButton({ uri }: Props) {
  const { t } = useTranslation('components', { keyPrefix: 'copy-uri-button' });

  return (
    <>
      {uri && (
        <Group pt={'sm'}>
          <Code>{t('label')}:</Code>
          <CopyToClipboardButton value={uri} />
        </Group>
      )}
    </>
  );
}

export default CopyUriButton;
