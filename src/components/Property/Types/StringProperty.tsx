import { Paper, Text } from '@mantine/core';

import { useGetStringPropertyValue } from '@/api/hooks';
import { StringInput } from '@/components/Input/StringInput';
import { PropertyProps } from '@/components/Property/types';

export function StringProperty({ uri, readOnly }: PropertyProps) {
  const [value, setValue] = useGetStringPropertyValue(uri);

  if (value === undefined) {
    return <></>;
  }

  if (readOnly) {
    return (
      <Paper px={'sm'} py={5}>
        <Text size={'sm'}>{value}</Text>
      </Paper>
    );
  }
  return <StringInput onEnter={setValue} value={value} aria-label={`${name} input`} />;
}
