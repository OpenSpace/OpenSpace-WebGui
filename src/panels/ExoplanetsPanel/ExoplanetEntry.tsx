import { useTranslation } from 'react-i18next';
import { ActionIcon, Group, Text } from '@mantine/core';

import { MinusIcon, PlusIcon } from '@/icons/icons';

interface ExoplanetProps {
  name: string;
  isAdded: boolean;
  onClick: () => void;
}

export function ExoplanetEntry({ name, isAdded, onClick }: ExoplanetProps) {
  const { t } = useTranslation('panel-exoplanets', { keyPrefix: 'exoplanet-entry' });

  return (
    <Group grow mb={'xs'}>
      <ActionIcon
        size={'lg'} // Fixed size, adjust as needed
        key={`${name}button`}
        variant={isAdded ? 'outline' : 'filled'}
        style={{ flexGrow: 0 }}
        onClick={onClick}
        color={isAdded ? 'red' : 'blue'}
        aria-label={`${
          isAdded ? t('remove-system-aria-label') : t('add-system-aria-label')
        }: ${name}`}
      >
        {isAdded ? <MinusIcon /> : <PlusIcon />}
      </ActionIcon>

      <Text style={{ flexGrow: 12, maxWidth: '100%' }}>{name}</Text>
    </Group>
  );
}
