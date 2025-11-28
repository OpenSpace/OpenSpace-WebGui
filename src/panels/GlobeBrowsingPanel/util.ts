/**
 * Converts a capbaility name into a identifier friendly version
 */
export function capabilityName(name: string) {
  return name.replaceAll('.', '-').replaceAll(' ', '');
}
