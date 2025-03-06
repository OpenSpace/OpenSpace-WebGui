import { Badge, Code, Paper, Table, Title } from '@mantine/core';

import { Action } from '@/types/types';

interface Props {
  selectedAction: Action;
}
export function KeybindInfo({ selectedAction }: Props) {
  return (
    <Paper key={selectedAction.identifier} p={'md'}>
      <Title order={4} mb={'md'}>
        {selectedAction.name}
      </Title>
      <Table>
        <Table.Tbody>
          <Table.Tr>
            <Table.Td>Description:</Table.Td>
            <Table.Td>{selectedAction.documentation}</Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td>Is Local:</Table.Td>
            <Table.Td>
              {selectedAction.synchronization ? (
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
        </Table.Tbody>
      </Table>
    </Paper>
  );
}
