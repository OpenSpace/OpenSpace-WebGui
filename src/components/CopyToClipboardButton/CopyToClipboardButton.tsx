import { useTranslation } from 'react-i18next';
import { ActionIcon, Button, CopyButton, Tooltip } from '@mantine/core';

import { CopyIcon } from '@/icons/icons';

interface Props {
  value: string;
  showLabel?: boolean;
  disabled?: boolean;
  copyTooltipLabel?: string;
  copyLabel?: string;
}

export function CopyToClipboardButton({
  value,
  showLabel,
  disabled,
  copyTooltipLabel,
  copyLabel
}: Props) {
  const { t } = useTranslation('components', { keyPrefix: 'copy-to-clipboard-button' });

  function tooltipLabel(copied: boolean) {
    if (copied) {
      return t('tooltip.copied');
    }
    return copyTooltipLabel ?? t('tooltip.copy');
  }

  return (
    <CopyButton value={value} timeout={2000}>
      {({ copied, copy }) => (
        <Tooltip label={tooltipLabel(copied)} position={'right'}>
          {showLabel ? (
            <Button
              color={copied ? 'teal' : 'gray'}
              variant={'light'}
              onClick={copy}
              rightSection={<CopyIcon />}
              disabled={disabled}
            >
              {copyLabel ?? t('label')}
            </Button>
          ) : (
            <ActionIcon
              color={copied ? 'teal' : 'gray'}
              size={'sm'}
              variant={'subtle'}
              onClick={copy}
              disabled={disabled}
              aria-label={tooltipLabel(copied)}
            >
              <CopyIcon />
            </ActionIcon>
          )}
        </Tooltip>
      )}
    </CopyButton>
  );
}
