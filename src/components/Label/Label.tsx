import { JSX } from 'react';
import { Group, InputLabel, Text } from '@mantine/core';

import { InfoBox } from '@/components/InfoBox/InfoBox';

interface Props {
  name: string | JSX.Element;
  description: string | JSX.Element;
}

export function Label({ name, description }: Props) {
  return (
    <Group wrap={'nowrap'}>
      <InputLabel fw={'normal'}>
        <Text span size={'sm'}>
          {name}
        </Text>
      </InputLabel>
      {description && <InfoBox>{description}</InfoBox>}
    </Group>
  );
}
