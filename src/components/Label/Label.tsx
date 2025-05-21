import { Group, InputLabel, Text } from '@mantine/core';

import { InfoBox } from '@/components/InfoBox/InfoBox';

interface Props {
  name: React.ReactNode;
  info?: React.ReactNode;
}

export function Label({ name, info }: Props) {
  return (
    <Group wrap={'nowrap'}>
      <InputLabel fw={'normal'}>
        <Text span size={'sm'}>
          {name}
        </Text>
      </InputLabel>
      {info && <InfoBox>{info}</InfoBox>}
    </Group>
  );
}
