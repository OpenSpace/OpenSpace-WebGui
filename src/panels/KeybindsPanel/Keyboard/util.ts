export function equals(openSpaceKey: string, simpleKeyboardKey: string) {
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

export const replacements = {
  '*': 'multiply',
  '/': 'divide',
  '-': 'subtract',
  '+': 'add'
};

// Converting from simple-keyboard key to OpenSpace key
export function keyToOpenSpaceKey(key: string) {
  let strippedKey = key;
  // Replace "numpad" with "keypad "
  if (strippedKey.includes('numpad')) {
    strippedKey = strippedKey.replace('numpad', 'keypad ');
  }

  // Replace numpad mathematical operations
  for (const [osKey, skKey] of Object.entries(replacements)) {
    strippedKey = strippedKey.replace(skKey, osKey);
  }

  // Remove curly braces
  strippedKey = strippedKey.replaceAll('{', '').replaceAll('}', '');

  // Remove "arrow" from the name
  if (strippedKey.startsWith('arrow')) {
    strippedKey = strippedKey.replace('arrow', '');
  }

  return strippedKey;
}

export function keyToSimpleKeyboardString(key: string) {
  // Key is a single character
  if (key.length === 1) {
    // Make alphabetic characters lower case
    const isAlphabetic = key.match(/[a-z]/i);
    if (isAlphabetic) {
      return key.toLowerCase();
    } // Non-alphabetic, numbers e.g.
    else {
      return key;
    }
  }

  // The rest (modifiers, numpads, etc)
  if (key === 'Right') {
    return '{arrowright}';
  }
  if (key === 'Left') {
    return '{arrowleft}';
  }
  if (key === 'Up') {
    return '{arrowup}';
  }
  if (key === 'Down') {
    return '{arrowdown}';
  }
  if (key.startsWith('Keypad')) {
    let newKey = `{${key.replace('Keypad ', 'numpad')}}`;

    const includesSingleDigit = /^[0-9]$/.test(newKey);
    if (includesSingleDigit) {
      return newKey;
    }

    for (const [current, replacement] of Object.entries(replacements)) {
      newKey = newKey.replace(current, replacement);
    }
  }
  if (!Number.isNaN(parseInt(key))) {
    // is a number
    console.log('Toot');

    return key;
  }
  return `{${key.toLowerCase()}}`;
}

export const commonKeyboardOptions = {
  theme: 'simple-keyboard hg-theme-default hg-layout-default',
  physicalKeyboardHighlight: true,
  syncInstanceInputs: true,
  mergeDisplay: true,
  debug: false
};
