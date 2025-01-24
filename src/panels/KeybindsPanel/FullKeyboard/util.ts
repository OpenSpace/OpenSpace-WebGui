import { Os2Sk } from './data';

export function equals(openSpaceKey: string, simpleKeyboardKey: string): boolean {
  return (
    openSpaceKey.toLowerCase() === keyToOpenSpaceKey(simpleKeyboardKey).toLowerCase()
  );
}

export function arraysEqual(a: string[], b: string[]): boolean {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  const aSorted = [...a].sort();
  const bSorted = [...b].sort();

  for (let i = 0; i < a.length; ++i) {
    if (aSorted[i] !== bSorted[i]) return false;
  }
  return true;
}

// Converting from simple-keyboard key to OpenSpace key
// Most of them are the same word but lower case and curly braces
export function keyToOpenSpaceKey(key: string): string {
  let strippedKey = key;
  // Replace numpad mathematical operations and arrows
  for (const [osKey, skKey] of Object.entries(Os2Sk)) {
    strippedKey = strippedKey.replace(skKey, osKey);
  }

  // Replace "numpad" with "Keypad " for remaining numpad symbols
  if (strippedKey.includes('numpad')) {
    strippedKey = strippedKey.replace('numpad', 'Keypad ');
  }

  // If there are curly braces still, remove them
  strippedKey = strippedKey.replaceAll('{', '').replaceAll('}', '');

  return strippedKey;
}

export function keyToSimpleKeyboardString(key: string): string {
  // Key is a single character
  if (key.length === 1) {
    // Is alphabetic character
    const isAlphabetic = key.match(/[A-Z]/i);
    if (isAlphabetic) {
      return key;
    } // Non-alphabetic, numbers e.g.
    else {
      return key;
    }
  }

  // Keypad math symbols and arrows
  if (key in Os2Sk) {
    return Os2Sk[key as keyof typeof Os2Sk];
  }

  // Remaining Keypad
  if (key.startsWith('Keypad')) {
    return `{${key.replace('Keypad ', 'numpad')}}`;
  }

  // All others
  return `{${key.toLowerCase()}}`;
}

export const commonKeyboardOptions = {
  theme: 'simple-keyboard hg-theme-default hg-layout-default',
  physicalKeyboardHighlight: true,
  syncInstanceInputs: true,
  mergeDisplay: true,
  debug: false
};
