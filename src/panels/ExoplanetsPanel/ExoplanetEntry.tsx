import { ActionIcon, Group, Text } from '@mantine/core';

import { MinusIcon, PlusIcon } from '@/icons/icons';

interface ExoplanetProps {
  name: string;
  isAdded: boolean;
  onClick: () => void;
  isLoading: boolean;
}

export function ExoplanetEntry({ name, isAdded, onClick, isLoading }: ExoplanetProps) {
  return (
    <Group grow mb={'xs'}>
      {
        <ActionIcon
          size={'lg'} // Fixed size, adjust as needed
          key={`${name}button`}
          style={{ flexGrow: 0 }}
          onClick={onClick}
          variant={isLoading ? 'light' : 'filled'}
          color={isAdded ? 'red' : 'blue'}
          loading={isLoading}
        >
          {isAdded ? <MinusIcon /> : <PlusIcon />}
        </ActionIcon>
      }
      <Text style={{ flexGrow: 12, maxWidth: '100%' }}>{name}</Text>
    </Group>
  );
}
