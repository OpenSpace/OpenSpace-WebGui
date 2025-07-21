import Keyboard, { KeyboardButtonTheme } from 'react-simple-keyboard';
import { Flex, ScrollArea, Stack } from '@mantine/core';

import { useAppSelector } from '@/redux/hooks';
import { KeybindInfoType } from '@/types/types';

import {
  ArrowsLayout,
  ControlPadLayout,
  KeyboardDisplayNames,
  KeyboardLayout,
  Modifiers,
  NumpadEndLayout,
  NumpadLayout
} from './data';
import {
  arraysEqual,
  commonKeyboardOptions,
  equals,
  keyToSimpleKeyboardString
} from './util';

import 'react-simple-keyboard/build/css/index.css';
import './FullKeyboard.css';

interface Props {
  setSelectedActions: (action: KeybindInfoType[]) => void;
  setActiveModifiers: (modifiers: string[]) => void;
  activeModifiers: string[];
  selectedKey: string;
  setSelectedKey: (kbd: string) => void;
}

export function FullKeyboard({
  setSelectedActions,
  setActiveModifiers,
  activeModifiers,
  selectedKey,
  setSelectedKey
}: Props) {
  const actions = useAppSelector((state) => state.actions.actions);
  const keybinds = useAppSelector((state) => state.actions.keybinds);

  function toggleModifier(modifier: string): void {
    // If it is already selected, remove the modifier
    if (activeModifiers.includes(modifier)) {
      setActiveModifiers(activeModifiers.filter((e) => e !== modifier));
    } // If it is not selected, add it
    else {
      setActiveModifiers([...activeModifiers, modifier]);
    }
  }

  function getActionsForKey(key: string): KeybindInfoType[] {
    // Find all action identifiers matching the given key and current modifiers
    // If no modifiers are active, it will match all keybinds with the given key
    const currentKeybinds = keybinds.filter(
      (keybind) =>
        keybind.key &&
        (activeModifiers.length > 0
          ? arraysEqual(activeModifiers, keybind.modifiers)
          : true) &&
        equals(keybind.key, key)
    );

    // Find the matching actions for the current keybind
    const currentActions = currentKeybinds.map((keybind) => {
      const action = actions.find((actions) => actions.identifier === keybind.action);
      if (!action) {
        return undefined; // If no action is found, return undefined
      }
      // Combine the keybind and action data into one object
      return {
        ...keybind,
        ...action
      };
    });
    // Remove the undefined items that were created from false matches
    return currentActions.filter((action) => action !== undefined);
  }

  function onKeyPress(input: string): void {
    // Handle modifier clicks
    if (Modifiers.includes(input)) {
      // Remove curly braces
      const strippedModifier = input.replaceAll('{', '').replaceAll('}', '');
      toggleModifier(strippedModifier);
      setSelectedActions([]);
      setSelectedKey('');
    } // Else just set the currently selected Action and keyboard button
    else {
      setSelectedKey(input);
      const current = getActionsForKey(input);
      setSelectedActions(current.length > 0 ? current : []);
    }
  }

  // Highlight the button that match the currently selected keyboard button (turquiose)
  function buttonThemeCurrentlySelected(): KeyboardButtonTheme {
    if (selectedKey.length > 0) {
      return { class: 'hg-highlight', buttons: selectedKey };
    }
    return null;
  }

  // Highlight the existing keyboard buttons for all keybinds (green)
  function buttonThemeExistingKeybinds(): KeyboardButtonTheme {
    const currentKeybinds = keybinds.filter((keybind) =>
      arraysEqual(activeModifiers, keybind.modifiers)
    );
    if (currentKeybinds.length > 0) {
      // Convert to keybinds to strings that simple-keyboard understands
      const currentKeysStrings = currentKeybinds.map((keybind) =>
        keyToSimpleKeyboardString(keybind.key)
      );
      return { class: 'hg-mapped', buttons: currentKeysStrings.join(' ') };
    }
    return null;
  }

  // Highlight selected modifiers keyboard buttons: alt, ctrl, super, shift (orange)
  function buttonThemeModifiers(): KeyboardButtonTheme {
    if (activeModifiers.length > 0) {
      return {
        class: 'hg-toggled',
        buttons: activeModifiers.map((s) => `{${s}}`).join(' ')
      };
    }

    return null;
  }

  // Get all button highlights and remove the ones which are null
  function buttonHighlights() {
    return [
      buttonThemeCurrentlySelected(),
      buttonThemeExistingKeybinds(),
      buttonThemeModifiers()
    ].filter((theme) => theme);
  }

  return (
    <ScrollArea>
      <Flex className={'simple-keyboard-background'} my={'xs'}>
        <Keyboard
          baseClass={'simple-keyboard-main'}
          layoutName={'default'}
          buttonTheme={buttonHighlights()}
          layout={{ default: KeyboardLayout }}
          display={KeyboardDisplayNames}
          onKeyPress={onKeyPress}
          {...commonKeyboardOptions}
        />
        <Stack justify={'space-between'}>
          <Keyboard
            baseClass={'simple-keyboard-control'}
            buttonTheme={buttonHighlights()}
            layout={{ default: ControlPadLayout }}
            onKeyPress={onKeyPress}
            {...commonKeyboardOptions}
          />
          <Keyboard
            baseClass={'simple-keyboard-arrows'}
            buttonTheme={buttonHighlights()}
            layout={{ default: ArrowsLayout }}
            onKeyPress={onKeyPress}
            {...commonKeyboardOptions}
          />
        </Stack>
        <Flex align={'flex-end'}>
          <Keyboard
            baseClass={'simple-keyboard-numpad'}
            buttonTheme={buttonHighlights()}
            onKeyPress={onKeyPress}
            layout={{ default: NumpadLayout }}
            {...commonKeyboardOptions}
          />
          <Keyboard
            baseClass={'simple-keyboard-numpadEnd'}
            buttonTheme={buttonHighlights()}
            layout={{ default: NumpadEndLayout }}
            onKeyPress={onKeyPress}
            {...commonKeyboardOptions}
          />
        </Flex>
      </Flex>
    </ScrollArea>
  );
}
