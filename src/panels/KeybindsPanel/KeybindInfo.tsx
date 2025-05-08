import { Badge, Code, Group, Paper, Table, Text } from '@mantine/core';

import { CopyToClipboardButton } from '@/components/CopyToClipboardButton/CopyToClipboardButton';
import { Action } from '@/types/types';

interface Props {
  selectedAction: Action;
}

export function KeybindInfo({ selectedAction }: Props) {
  return (
    <Paper key={selectedAction.identifier} p={'sm'}>
      <Text ml={'xs'} mb={'xs'} fw={'bold'}>
        {selectedAction.name}
      </Text>
      <Table>
        <Table.Tbody>
          <Table.Tr>
            <Table.Td>Description:</Table.Td>
            <Table.Td>{selectedAction.documentation}</Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td>Is Local:</Table.Td>
            <Table.Td>
              {selectedAction.isLocal ? (
                <Badge variant={'filled'}>Yes</Badge>
              ) : (
                <Badge variant={'outline'}>No</Badge>
              )}
            </Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td>GUI Path:</Table.Td>
            <Table.Td>
              <Code>{selectedAction.guiPath}</Code>
            </Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td>Identifier:</Table.Td>
            <Table.Td>
              <Group gap={'xs'} wrap={'nowrap'}>
                <Code style={{ wordBreak: 'break-word' }}>
                  {selectedAction.identifier}
                </Code>
                <CopyToClipboardButton value={selectedAction.identifier} />
              </Group>
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </Paper>
  );
}
