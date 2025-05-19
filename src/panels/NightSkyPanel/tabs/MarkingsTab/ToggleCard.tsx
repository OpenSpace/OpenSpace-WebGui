import { Group, Paper, Stack, Text } from '@mantine/core';

interface Props {
  checkbox: React.JSX.Element;
  title: string;
  icon: React.JSX.Element;
}

export function ToggleCard({ checkbox, title, icon }: Props) {
  return (
    <Paper p={'xs'}>
      <Group justify={'center'}>
        {checkbox}
        <Stack align={'center'} flex={1} gap={3}>
          {icon}
          <Text>{title}</Text>
        </Stack>
      </Group>
    </Paper>
  );
}
