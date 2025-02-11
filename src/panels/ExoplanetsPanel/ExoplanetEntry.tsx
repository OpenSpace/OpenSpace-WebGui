import { ActionIcon, Group, Text } from '@mantine/core';

import { MinusIcon, PlusIcon } from '@/icons/icons';

interface ExoplanetProps {
  name: string;
  isAdded: boolean;
  onClick: () => void;
}

export function ExoplanetEntry({ name, isAdded, onClick }: ExoplanetProps) {
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
        >
          {isAdded ? <MinusIcon /> : <PlusIcon />}
        </ActionIcon>
      }
      <Text style={{ flexGrow: 12, maxWidth: '100%' }}>{name}</Text>
    </Group>
  );
}
