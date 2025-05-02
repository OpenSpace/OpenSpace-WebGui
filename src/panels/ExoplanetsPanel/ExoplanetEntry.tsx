import { ActionIcon, Group, Text } from '@mantine/core';

import { MinusIcon, PlusIcon } from '@/icons/icons';
import { useTranslation } from 'react-i18next';

interface ExoplanetProps {
  name: string;
  isAdded: boolean;
  onClick: () => void;
}

export function ExoplanetEntry({ name, isAdded, onClick }: ExoplanetProps) {
  const { t } = useTranslation('exoplanetspanel');

  const ariaLabel = `${
    isAdded ? t('exoplanet-entry.remove-aria-label') : t('exoplanet-entry.add-aria-label')
  }: ${name}`;
  return (
    <Group grow mb={'xs'}>
      {
        <ActionIcon
          size={'lg'} // Fixed size, adjust as needed
          key={`${name}button`}
          variant={isAdded ? 'outline' : 'filled'}
          style={{ flexGrow: 0 }}
          onClick={onClick}
          color={isAdded ? 'red' : 'blue'}
          aria-label={ariaLabel}
        >
          {isAdded ? <MinusIcon /> : <PlusIcon />}
        </ActionIcon>
      }
      <Text style={{ flexGrow: 12, maxWidth: '100%' }}>{name}</Text>
    </Group>
  );
}
