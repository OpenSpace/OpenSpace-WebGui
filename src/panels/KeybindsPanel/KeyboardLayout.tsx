import { useState } from 'react';
import { Container, Divider, Grid, Group, Stack, Text, Title } from '@mantine/core';

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
    <Container maw={'none'}>
      <FullKeyboard
        setSelectedActions={setSelectedActions}
        setActiveModifiers={setActiveModifiers}
        setSelectedKey={setSelectedKey}
        selectedKey={selectedKey}
        activeModifiers={activeModifiers}
      />
      <Group align={'top'}>
        <Stack>
          <Title order={2}>Selected keybind:</Title>
          <KeybindButtons selectedKey={selectedKey} modifiers={activeModifiers} />
        </Stack>
        <Divider orientation={'vertical'} mx={'xs'} />
        <Stack flex={1}>
          <Title order={2}>Mapped actions:</Title>
          {selectedActions.length > 0 ? (
            <Grid mx={'xs'}>
              {selectedActions.map((selectedAction) => (
                <KeybindInfo key={selectedAction.identifier} action={selectedAction} />
              ))}
            </Grid>
          ) : (
            <Text>
              {hasSelectedKeys
                ? 'No action is associated with this keybind.'
                : 'No key selected. Select a key to see its action.'}
            </Text>
          )}
        </Stack>
      </Group>
    </Container>
  );
}
