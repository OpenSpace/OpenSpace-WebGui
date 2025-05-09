import { Badge, Code, Group, Paper, Table, Text } from '@mantine/core';

import { CopyToClipboardButton } from '@/components/CopyToClipboardButton/CopyToClipboardButton';
import { Action } from '@/types/types';

interface Props {
  action: Action;
}

export function KeybindInfo({ action }: Props) {
  return (
    <Paper key={action.identifier} p={'sm'}>
      <Text ml={'xs'} mb={2} fw={'bold'}>
        {action.name}
      </Text>
      <Table
        data={{
          body: [
            ['Info:', action.documentation],
            [
              'Is Local:',
              action.isLocal ? (
                <Badge variant={'filled'}>Yes</Badge>
              ) : (
                <Badge variant={'outline'}>No</Badge>
              )
            ],
            ['GUI Path:', <Code>{action.guiPath}</Code>],
            [
              'Identifier:',
              <Group gap={'xs'} wrap={'nowrap'}>
                <Code style={{ wordBreak: 'break-word' }}>{action.identifier}</Code>
                <CopyToClipboardButton value={action.identifier} />
              </Group>
            ]
          ]
        }}
      />
    </Paper>
  );
}
