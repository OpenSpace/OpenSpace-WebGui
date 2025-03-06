import { Flex, Group, Text } from '@mantine/core';

interface Props {
  title: string | React.ReactNode;
  leftSection?: React.ReactNode;
  rightSection?: React.ReactNode;
}

export function ThreePartHeader({ title, leftSection, rightSection }: Props) {
  return (
    <Group justify={'space-between'} gap={'xs'} wrap={'nowrap'} w={'100%'}>
      {leftSection}
      {typeof title === 'string' ? (
        <Text truncate flex={1}>
          {title}
        </Text>
      ) : (
        <Flex flex={1}>{title}</Flex>
      )}
      {rightSection}
    </Group>
  );
}
