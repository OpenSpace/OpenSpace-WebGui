export const KeyboardLayout = [
  '{escape} {f1} {f2} {f3} {f4} {f5} {f6} {f7} {f8} {f9} {f10} {f11} {f12}',
  '` 1 2 3 4 5 6 7 8 9 0 - = {backspace}',
  '{tab} Q W E R T Y U I O P [ ] \\',
  "{capslock} A S D F G H J K L ; ' {enter}",
  '{shift} Z X C V B N M , . / {shift}',
  '{control} {alt} {space} {super}'
];

export const KeyboardDisplayNames = {
  '{escape}': 'esc ⎋',
  '{tab}': 'tab ⇥',
  '{backspace}': 'backspace ⌫',
  '{enter}': 'enter ↵',
  '{capslock}': 'caps lock ⇪',
  '{shift}': 'shift ⇧',
  '{control}': 'ctrl ⌃',
  '{alt}': 'alt ⌥',
  '{super}': 'super',
  '{f1}': 'F1',
  '{f2}': 'F2',
  '{f3}': 'F3',
  '{f4}': 'F4',
  '{f5}': 'F5',
  '{f6}': 'F6',
  '{f7}': 'F7',
  '{f8}': 'F8',
  '{f9}': 'F9',
  '{f10}': 'F10',
  '{f11}': 'F11',
  '{f12}': 'F12'
};

export const ControlPadLayout = [
  '{prtscr} {scrolllock} {pause}',
  '{insert} {home} {pageup}',
  '{delete} {end} {pagedown}'
];

export const ArrowsLayout = ['{arrowup}', '{arrowleft} {arrowdown} {arrowright}'];

export const NumpadLayout = [
  '{numlock} {numpaddivide} {numpadmultiply}',
  '{numpad7} {numpad8} {numpad9}',
  '{numpad4} {numpad5} {numpad6}',
  '{numpad1} {numpad2} {numpad3}',
  '{numpad0} {numpaddecimal}'
];

export const NumpadEndLayout = ['{numpadsubtract}', '{numpadadd}', '{numpadenter}'];

export const Os2Sk: { [key: string]: string } = {
  'Keypad *': '{numpadmultiply}',
  'Keypad /': '{numpaddivide}',
  'Keypad -': '{numpadsubtract}',
  'Keypad +': '{numpadadd}',
  Up: '{arrowup}',
  Left: '{arrowleft}',
  Right: '{arrowright}',
  Down: '{arrowdown}'
};

export const Modifiers = ['{shift}', '{alt}', '{control}', '{super}'];
