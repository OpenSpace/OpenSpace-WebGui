import { Group, Stack, Text } from '@mantine/core';

interface Props {
  objectName: string;
  description: React.ReactNode;
  extraContent?: React.ReactNode;
}

export function ConfirmModalContent({ objectName, description, extraContent }: Props) {
  return (
    <Stack>
      <Text>{description}</Text>
      <Group gap={'xs'}>
        <Text fw={500} size={'lg'} style={{ wordBreak: 'break-word' }}>
          {objectName}
        </Text>
        <Text>?</Text>
      </Group>
      {extraContent}
    </Stack>
  );
}
