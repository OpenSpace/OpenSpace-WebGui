import { Fragment } from 'react/jsx-runtime';
import { Group, Kbd, Text } from '@mantine/core';

import { KeyboardDisplayNames } from './Keyboard/Layouts';
import { keyToOpenSpaceKey } from './Keyboard/util';

interface KeybindProps {
  modifiers: string[];
  selectedKey: string;
}

export function Keybind({ modifiers, selectedKey }: KeybindProps) {
  const displayKey =
    selectedKey in KeyboardDisplayNames
      ? KeyboardDisplayNames[selectedKey as keyof typeof KeyboardDisplayNames]
      : keyToOpenSpaceKey(selectedKey);

  // Remove empty string if selected key is ""
  const allKeys = [...modifiers, displayKey].filter((kbd) => kbd);

  return (
    <Group>
      {allKeys.map((kbd, i) => (
        <Fragment key={kbd}>
          {i !== 0 && <Text> + </Text>}
          <Kbd>{kbd}</Kbd>
        </Fragment>
      ))}
    </Group>
  );
}
