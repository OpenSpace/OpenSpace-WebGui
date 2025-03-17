import { Paper, Text } from '@mantine/core';

import { StringInput } from '@/components/Input/StringInput';

import { PropertyProps } from '../types';
import { useGetStringPropertyValue, useGetPropertyDescription } from '@/api/hooks';

export function StringProperty({ uri }: PropertyProps) {
  const [value, setValue] = useGetStringPropertyValue(uri);
  const description = useGetPropertyDescription(uri);

  if (!value || !description) {
    return <></>;
  }

  if (description?.metaData.isReadOnly) {
    return (
      <Paper px={'sm'} py={5}>
        <Text size={'sm'}>{value}</Text>
      </Paper>
    );
  }
  return <StringInput onEnter={setValue} value={value} aria-label={`${name} input`} />;
}
