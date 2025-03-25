import { Paper, Text } from '@mantine/core';

import { StringInput } from '@/components/Input/StringInput';
import { PropertyProps } from '@/components/Property/types';
import { usePropertyDescription, useStringProperty } from '@/hooks/properties';

export function StringProperty({ uri, readOnly }: PropertyProps) {
  const [value, setValue] = useStringProperty(uri);
  const description = usePropertyDescription(uri);

  if (value === undefined || !description) {
    return <></>;
  }

  if (readOnly) {
    return (
      <Paper px={'sm'} py={5}>
        <Text size={'sm'}>{value}</Text>
      </Paper>
    );
  }
  return (
    <StringInput
      onEnter={setValue}
      value={value}
      aria-label={`${description.name} input`}
    />
  );
}
