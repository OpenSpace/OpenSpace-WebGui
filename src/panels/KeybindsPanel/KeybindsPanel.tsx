import { useState } from 'react';
import {
  Badge,
  Code,
  Container,
  Divider,
  Grid,
  Group,
  Paper,
  Table,
  Text,
  Title
} from '@mantine/core';

import { Action } from '@/types/types';

import { FullKeyboard } from './FullKeyboard/FullKeyboard';
import { KeybindButtons } from './KeybindButtons';

export function KeyBindsPanel() {
  const [selectedActions, setSelectedActions] = useState<Action[]>([]);
  const [activeModifiers, setActiveModifiers] = useState<string[]>([]);
  const [selectedKey, setSelectedKey] = useState<string>('');

  const hasSelectedKeys = selectedKey === '' && activeModifiers.length === 0;
  return (
    <Container maw={'none'}>
      <FullKeyboard
        setSelectedActions={setSelectedActions}
        setActiveModifiers={setActiveModifiers}
        setSelectedKey={setSelectedKey}
        selectedKey={selectedKey}
        activeModifiers={activeModifiers}
      />
      <Group my={'md'}>
        <Title order={3}>Selected keybind:</Title>
        <KeybindButtons selectedKey={selectedKey} modifiers={activeModifiers} />
      </Group>
      <Divider />
      <Title order={3} my={'md'}>
        Mapped actions
      </Title>
      {selectedActions.length > 0 ? (
        <Grid mx={'xs'}>
          {selectedActions.map((selectedAction) => (
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
          ))}
        </Grid>
      ) : (
        <Text>
          {hasSelectedKeys
            ? 'No action is associated with this keybind.'
            : 'No key selected. Select a key to see its action.'}
        </Text>
      )}
    </Container>
  );
}
