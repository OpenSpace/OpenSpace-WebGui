import { Paper, Text } from '@mantine/core';

import { useGetPropertyDescription, useGetStringPropertyValue } from '@/api/hooks';
import { StringInput } from '@/components/Input/StringInput';

import { PropertyProps } from '@/components/Property/types';

export function StringProperty({ uri }: PropertyProps) {
  const [value, setValue] = useGetStringPropertyValue(uri);
  const description = useGetPropertyDescription(uri);

  if (value === undefined || !description) {
    return <></>;
  }

  if (description.metaData.isReadOnly) {
    return (
      <Paper px={'sm'} py={5}>
        <Text size={'sm'}>{value}</Text>
      </Paper>
    );
  }
  return <StringInput onEnter={setValue} value={value} aria-label={`${name} input`} />;
}
