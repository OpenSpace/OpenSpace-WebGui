import { Flex, Group, Text } from '@mantine/core';

interface Props {
  title: string | React.ReactNode;
  leftSection?: React.ReactNode;
  rightSection?: React.ReactNode;
}

export function ThreePartHeader({ title, leftSection, rightSection }: Props) {
  return (
    <Group justify={'space-between'} gap={'xs'} wrap={'nowrap'}>
      {leftSection}
      <Flex flex={1}>
        {typeof title === 'string' ? (
          <Text
            ta={'left'}
            style={{ textWrap: 'pretty', overflowWrap: 'anywhere' }}
            lineClamp={1}
          >
            {title}
          </Text>
        ) : (
          title
        )}
      </Flex>
      {rightSection}
    </Group>
  );
}
