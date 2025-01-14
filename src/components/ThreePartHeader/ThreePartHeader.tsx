import { Group } from '@mantine/core';

interface Props {
  title: React.ReactNode;
  leftSection?: React.ReactNode;
  rightSection?: React.ReactNode;
}

export function ThreePartHeader({ title, leftSection, rightSection }: Props) {
  return (
    <Group justify={'space-between'} gap={'xs'} wrap={'nowrap'} w={'100%'}>
      <Group gap={'xs'} flex={1} wrap={'nowrap'}>
        {leftSection && leftSection}
        {title}
      </Group>
      {rightSection && rightSection}
    </Group>
  );
}
