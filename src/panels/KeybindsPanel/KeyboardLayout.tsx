import { useState } from 'react';
import { Container, Divider, Grid, Group, Text, Title } from '@mantine/core';

import { Action } from '@/types/types';

import { FullKeyboard } from './FullKeyboard/FullKeyboard';
import { KeybindButtons } from './KeybindButtons';
import { KeybindInfo } from './KeybindInfo';

export function KeyboardLayout() {
  const [selectedActions, setSelectedActions] = useState<Action[]>([]);
  const [activeModifiers, setActiveModifiers] = useState<string[]>([]);
  const [selectedKey, setSelectedKey] = useState<string>('');

  const hasSelectedKeys = selectedKey !== '' || activeModifiers.length > 0;
  return (
    <Container maw={'none'} pt={'xs'}>
      <Title order={2}>Keybinds</Title>
      <FullKeyboard
        setSelectedActions={setSelectedActions}
        setActiveModifiers={setActiveModifiers}
        setSelectedKey={setSelectedKey}
        selectedKey={selectedKey}
        activeModifiers={activeModifiers}
      />
      <Group my={'md'}>
        <Text size={'lg'} fw={500}>
          Selected keybind:
        </Text>
        <KeybindButtons selectedKey={selectedKey} modifiers={activeModifiers} />
      </Group>
      <Divider />
      <Title order={3} my={'md'}>
        Mapped actions
      </Title>
      {selectedActions.length > 0 ? (
        <Grid mx={'xs'}>
          {selectedActions.map((selectedAction) => (
            <KeybindInfo
              key={selectedAction.identifier}
              selectedAction={selectedAction}
            />
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
