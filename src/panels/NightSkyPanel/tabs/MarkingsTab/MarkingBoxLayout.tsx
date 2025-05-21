import { Group, Paper, Skeleton, Stack, Text } from '@mantine/core';

interface Props {
  checkbox: React.JSX.Element;
  title: string;
  icon: React.JSX.Element;
  isLoading?: boolean;
}

export function MarkingBoxLayout({ checkbox, title, icon, isLoading }: Props) {
  return (
    <Skeleton visible={isLoading}>
      <Paper py={'xs'} px={'sm'}>
        <Group justify={'center'} gap={'xs'}>
          {checkbox}
          <Stack align={'center'} flex={1} gap={3}>
            {icon}
            <Text>{title}</Text>
          </Stack>
        </Group>
      </Paper>
    </Skeleton>
  );
}
