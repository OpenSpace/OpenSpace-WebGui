import { Group, Text } from '@mantine/core';

interface Props {
  title: React.ReactNode;
  leftSection?: React.ReactNode;
  rightSection?: React.ReactNode;
}

export function ThreePartHeader({ title, leftSection, rightSection }: Props) {
  return (
    <Group justify={'space-between'} gap={'xs'} w={'100%'}>
      {leftSection}
      <Text truncate flex={1}>
        {title}
      </Text>
      {rightSection}
    </Group>
  );
}
