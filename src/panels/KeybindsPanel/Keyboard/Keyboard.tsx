import Keyboard from 'react-simple-keyboard';

import { useAppSelector } from '@/redux/hooks';
import { Action } from '@/types/types';

import {
  ArrowsLayout,
  ControlPadLayout,
  KeyboardDisplayNames,
  KeyboardLayout,
  NumpadEndLayout,
  NumpadLayout
} from './Layouts';
import {
  arraysEqual,
  commonKeyboardOptions,
  equals,
  keyToSimpleKeyboardString} from './util';

import 'react-simple-keyboard/build/css/index.css';
import './KeybindingPanelKeyboard.css';

interface Props {
  setSelectedActions: (action: Action[]) => void;
  setActiveModifiers: (modifiers: string[]) => void;
  activeModifiers: string[];
  selectedKey: string;
  setSelectedKey: (kbd: string) => void;
}

export function KeyboardComponent({
  setSelectedActions,
  setActiveModifiers,
  activeModifiers,
  selectedKey,
  setSelectedKey
}: Props) {
  const actions = useAppSelector((state) => state.actions.actions);
  const keybinds = useAppSelector((state) => state.actions.keybinds);
  const modifiers = ['{shift}', '{alt}', '{control}', '{super}'];

  function toggleModifier(modifier: string) {
    // If it is already selected, remove the modifier
    if (activeModifiers.includes(modifier)) {
      setActiveModifiers(activeModifiers.filter((e) => e !== modifier));
    } // If it is not selected, add it
    else {
      setActiveModifiers([...activeModifiers, modifier]);
    }
  }

  function getActionsForKey(key: string): Action[] {
    // Find all action identifiers matching the given key and current modifiers
    const currentKeybinds = keybinds.filter(
      (keybind) =>
        keybind.key &&
        arraysEqual(activeModifiers, keybind.modifiers) &&
        equals(keybind.key, key)
    );

    // Find the matching actions for the current keybind
    const currentActions = currentKeybinds.map((keybind) =>
      actions.find((actions) => actions.identifier === keybind.action)
    );
    // Remove the undefined items that were created from false matches
    return currentActions.filter((action) => action !== undefined);
  }

  function onKeyPress(input: string) {
    // Handle modifier clicks
    if (modifiers.includes(input)) {
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
  // TODO @micahnyc fix colors not from scss
  function buttonHighlights() {
    const buttonTheme = [];

    // Highlight the button that match the currently selected keyboard button (turquiose)
    if (selectedKey.length > 0) {
      buttonTheme.push({ class: 'hg-highlight', buttons: selectedKey });
    }

    // Highlight the existing keyboard buttons for all keybinds (they show up as green)
    const currentKeybinds = keybinds.filter((keybind) =>
      arraysEqual(activeModifiers, keybind.modifiers)
    );
    if (currentKeybinds.length > 0) {
      // Convert to keybinds to strings that simple-keyboard understands
      const currentKeysStrings = currentKeybinds.map((keybind) =>
        keyToSimpleKeyboardString(keybind.key)
      );
      buttonTheme.push({ class: 'hg-mapped', buttons: currentKeysStrings.join(' ') });
    }

    // Highlight modifiers keyboard buttons (ctr, super, shift)
    if (activeModifiers.length > 0) {
      buttonTheme.push({
        class: 'hg-toggled',
        buttons: activeModifiers.map((s) => `{${s}}`).join(' ')
      });
    }

    return buttonTheme;
  }

  return (
    <div className={"keyboardContainer"}>
      <Keyboard
        baseClass={"simple-keyboard-main"}
        layoutName={'default'}
        buttonTheme={buttonHighlights()}
        layout={{ default: KeyboardLayout }}
        display={KeyboardDisplayNames}
        onKeyPress={(button: any) => onKeyPress(button)}
        {...commonKeyboardOptions}
      />
      <div className={"controlArrows"}>
        <Keyboard
          baseClass={"simple-keyboard-control"}
          buttonTheme={buttonHighlights()}
          layout={{ default: ControlPadLayout }}
          onKeyPress={(button: any) => onKeyPress(button)}
          {...commonKeyboardOptions}
        />
        <Keyboard
          baseClass={"simple-keyboard-arrows"}
          buttonTheme={buttonHighlights()}
          layout={{ default: ArrowsLayout }}
          onKeyPress={(button: any) => onKeyPress(button)}
          {...commonKeyboardOptions}
        />
      </div>
      <div className={"numPad"}>
        <Keyboard
          baseClass={"simple-keyboard-numpad"}
          buttonTheme={buttonHighlights()}
          onKeyPress={(button: any) => onKeyPress(button)}
          layout={{ default: NumpadLayout }}
          {...commonKeyboardOptions}
        />
        <Keyboard
          baseClass={"simple-keyboard-numpadEnd"}
          buttonTheme={buttonHighlights()}
          layout={{ default: NumpadEndLayout }}
          onKeyPress={(button: any) => onKeyPress(button)}
          {...commonKeyboardOptions}
        />
      </div>
    </div>
  );
}
