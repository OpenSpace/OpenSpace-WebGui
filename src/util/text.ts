import { Identifier } from '@/types/types';

export function camelCaseToRegularText(camelCase: string): string {
  return camelCase
    .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space between lowercase and uppercase letters
    .replace(/^./, (str) => str.toUpperCase()); // Capitalize the first letter
}

/**
 * Converts the input string into an identifier friendly version. Mimicing the OpenSpace
 * Lua function `MakeIdentifier` https://docs.openspaceproject.com/latest/reference/scripting-api/openspace.html#makeidentifier
 *
 * @param input The input string to convert
 * @returns The converted identifier
 */
export function makeIdentifier(input: string): Identifier {
  // Note that we want to preserve '-' and '_', but replace any other punctuation
  // marks. Hence, we first convert '_' to whitespaces to avoid them being replaced
  // in the puncutation check
  let str = input.replace(/_/g, ' ');

  // C++ std::ispunct defines the following characters as punctuation:
  // !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~
  // Note: underscore '_' is excluded as we have already replaced them with spaces
  const punctuationRegex = /[!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~]/g;
  str = str.replace(punctuationRegex, '-');

  // Convert spaces to underscores
  str = str.replace(/ /g, '_');
  return str;
}
