import { PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { ActionIcon, Box, Group, Tooltip } from '@mantine/core';

import { RefreshIcon } from '@/icons/icons';

interface Props extends PropsWithChildren {
  // The name of the field, used to describe the button
  label: string;
  onReset: () => void;
  disabled?: boolean;
  // How to align the button with the field. Use `center` for fields without a label
  align?: 'flex-end' | 'center';
}

/**
 * Shows a field with a button next to it that sets the field to the current value in
 * OpenSpace.
 */
export function ResettableField({
  label,
  onReset,
  disabled,
  align = 'flex-end',
  children
}: Props) {
  const { t } = useTranslation('panel-testwizard');

  const buttonLabel = t('set-current-value', { field: label });

  return (
    <Group align={align} gap={'xs'} wrap={'nowrap'}>
      <Box flex={1} miw={0}>
        {children}
      </Box>
      <Tooltip label={buttonLabel}>
        <ActionIcon
          size={'input-sm'}
          variant={'light'}
          onClick={onReset}
          disabled={disabled}
          aria-label={buttonLabel}
        >
          <RefreshIcon />
        </ActionIcon>
      </Tooltip>
    </Group>
  );
}
