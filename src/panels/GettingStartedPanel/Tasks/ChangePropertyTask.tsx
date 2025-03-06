import { Checkbox } from '@mantine/core';

import { useGetBoolPropertyValue } from '@/api/hooks';

interface Props {
  uri: string;
  finalValue: boolean;
  label: string;
}

export function SetBoolPropertyTask({ label, uri, finalValue }: Props) {
  const [value] = useGetBoolPropertyValue(uri);

  const taskCompleted = value === finalValue;
  return (
    <Checkbox
      size={'lg'}
      c={'orange'}
      color={'green'}
      checked={taskCompleted}
      onChange={() => {}}
      label={`Task: ${label}`}
      style={{ cursor: 'default' }}
    />
  );
}
