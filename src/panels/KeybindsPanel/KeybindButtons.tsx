import { Fragment } from 'react/jsx-runtime';
import { Group, Kbd, MantineStyleProps, Text } from '@mantine/core';

import { KeyboardDisplayNames } from './FullKeyboard/data';
import { keyToOpenSpaceKey } from './FullKeyboard/util';

interface KeybindButtonsProps extends MantineStyleProps {
  modifiers?: string[];
  selectedKey?: string;
}

export function KeybindButtons({
  modifiers = [],
  selectedKey = '',
  ...styleProps
}: KeybindButtonsProps) {
  // Get the display version of the simple-keyboard input key
  const displayKey =
    selectedKey in KeyboardDisplayNames
      ? KeyboardDisplayNames[selectedKey as keyof typeof KeyboardDisplayNames]
      : keyToOpenSpaceKey(selectedKey);

  // Remove empty string if selected key is ""
  const allKeys = [...modifiers, displayKey].filter((kbd) => kbd);

  return (
    <Group wrap={'nowrap'} gap={'xs'} {...styleProps}>
      {allKeys.map((kbd, i) => (
        <Fragment key={kbd}>
          {i !== 0 && <Text c={'white'}> + </Text>}
          <Kbd size={'md'}>{kbd}</Kbd>
        </Fragment>
      ))}
    </Group>
  );
}
