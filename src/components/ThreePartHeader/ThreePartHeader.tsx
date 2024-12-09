import { Group } from '@mantine/core';

interface Props {
  text: React.ReactNode;
  leftSection?: React.ReactNode;
  rightSection?: React.ReactNode;
}

export function ThreePartHeader({ text, leftSection, rightSection }: Props) {
  return (
    <Group justify={'space-between'} wrap={'nowrap'} w={'100%'}>
      <Group gap={'xs'} wrap={'nowrap'}>
        {leftSection && leftSection}
        {text}
      </Group>
      {rightSection && rightSection}
    </Group>
  );
}
