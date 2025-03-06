import { Checkbox } from '@mantine/core';

interface Props {
  taskCompleted: boolean;
  label: string;
}

export function TaskCheckbox({ taskCompleted, label }: Props) {
  return (
    <Checkbox
      size={'lg'}
      c={'orange'}
      color={'green'}
      checked={taskCompleted}
      onChange={() => {}}
      label={`Task: ${label}`}
    />
  );
}
