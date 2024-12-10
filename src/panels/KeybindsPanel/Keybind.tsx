import { Action, Keybind as KeybindType } from '@/types/types';
import { Group, Kbd, Text } from '@mantine/core';
import { Fragment } from 'react/jsx-runtime';

interface KeybindProps {
  keybind: KeybindType;
  action: Action;
}

export function Keybind({ keybind, action }: KeybindProps) {
  return (
    <Group>
      <Group flex={1}>
        <Kbd>{keybind.key}</Kbd>
        {keybind.modifiers.map((modifier) => (
          <Fragment key={modifier}>
            <Kbd>{modifier}</Kbd>
          </Fragment>
        ))}
      </Group>
      <Group flex={3}>
        <Text>{action.name}</Text>
        <Text>{action.guiPath}</Text>
      </Group>
    </Group>
  );
}
