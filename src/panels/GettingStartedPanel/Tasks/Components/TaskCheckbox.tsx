import { useRef } from 'react';
import { Checkbox } from '@mantine/core';

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
    <Checkbox
      size={'lg'}
      c={'orange'}
      color={'green'}
      checked={hasEverBeenCompleted.current}
      readOnly
      label={`Task: ${label}`}
    />
  );
}
