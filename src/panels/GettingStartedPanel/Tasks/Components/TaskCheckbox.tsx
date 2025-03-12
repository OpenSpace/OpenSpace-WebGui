import { useRef } from 'react';
import { Checkbox, Group, Text } from '@mantine/core';

interface Props {
  taskCompleted: boolean;
  label: string;
}

export function TaskCheckbox({ taskCompleted, label }: Props) {
  const hasEverBeenCompleted = useRef<boolean>(false);
  if (taskCompleted) {
    hasEverBeenCompleted.current = true;
  }
  return (
    <Group>
      <Checkbox.Indicator
        size={'lg'}
        color={'green'}
        checked={hasEverBeenCompleted.current}
        style={{ cursor: 'default' }}
      />
      <Text c={'orange'} size={"lg"}>
        {label}
      </Text>
    </Group>
  );
}
