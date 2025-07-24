import { Flex, Group } from '@mantine/core';

import { TruncatedText } from '../TruncatedText/TruncatedText';

interface Props {
  title: React.ReactNode;
  leftSection?: React.ReactNode;
  rightSection?: React.ReactNode;
}

export function ThreePartHeader({ title, leftSection, rightSection }: Props) {
  return (
    <Group justify={'left'} gap={'xs'} wrap={'nowrap'}>
      {leftSection}
      <Flex flex={1} miw={0}>
        {typeof title === 'string' ? <TruncatedText>{title}</TruncatedText> : title}
      </Flex>
      {rightSection}
    </Group>
  );
}
