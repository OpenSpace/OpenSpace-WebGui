import { useTranslation } from 'react-i18next';
import { ActionIcon } from '@mantine/core';

import { CancelIcon } from '@/icons/icons';

interface Props {
  onClick: () => void;
  ariaLabel?: string;
}

export function ClearButton({ onClick, ariaLabel }: Props) {
  const { t } = useTranslation('components', { keyPrefix: 'clear-button' });

  return (
    <ActionIcon
      size={'lg'}
      variant={'subtle'}
      color={'gray'}
      onClick={onClick}
      aria-label={ariaLabel || t('aria-label')}
    >
      <CancelIcon />
    </ActionIcon>
  );
}
