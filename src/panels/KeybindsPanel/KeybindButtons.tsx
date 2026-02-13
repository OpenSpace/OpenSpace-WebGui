import { Fragment } from 'react/jsx-runtime';
import { Group, Kbd, MantineStyleProps, Text } from '@mantine/core';

import { Keybind } from '@/types/types';

import { KeyboardDisplayNames } from './FullKeyboard/data';
import { keyToOpenSpaceKey } from './FullKeyboard/util';

interface KeybindButtonsProps extends MantineStyleProps {
  keybind: Keybind;
}

export function KeybindButtons({ keybind, ...styleProps }: KeybindButtonsProps) {
  // Get the display version of the simple-keyboard input key
  const displayKey =
    keybind.key in KeyboardDisplayNames
      ? KeyboardDisplayNames[keybind.key as keyof typeof KeyboardDisplayNames]
      : keyToOpenSpaceKey(keybind.key);

  // Remove empty string if selected key is ""
  const allKeys = [...keybind.modifiers, displayKey].filter((kbd) => kbd);

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
