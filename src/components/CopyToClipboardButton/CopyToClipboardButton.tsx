import { useTranslation } from 'react-i18next';
import { ActionIcon, Button, CopyButton, Tooltip } from '@mantine/core';

import { CopyIcon } from '@/icons/icons';

interface Props {
  value: string;
  showLabel?: boolean;
  disabled?: boolean;
}

export function CopyToClipboardButton({ value, showLabel, disabled }: Props) {
  const { t } = useTranslation('components', { keyPrefix: 'copy-to-clipboard-button' });

  return (
    <CopyButton value={value} timeout={2000}>
      {({ copied, copy }) => (
        <Tooltip
          label={copied ? t('tooltip.copied') : t('tooltip.copy')}
          position={'right'}
        >
          {showLabel ? (
            <Button
              color={copied ? 'teal' : 'gray'}
              variant={'light'}
              onClick={copy}
              rightSection={<CopyIcon />}
              disabled={disabled}
            >
              {t('label')}
            </Button>
          ) : (
            <ActionIcon
              color={copied ? 'teal' : 'gray'}
              size={'sm'}
              variant={'subtle'}
              onClick={copy}
              disabled={disabled}
            >
              <CopyIcon />
            </ActionIcon>
          )}
        </Tooltip>
      )}
    </CopyButton>
  );
}
