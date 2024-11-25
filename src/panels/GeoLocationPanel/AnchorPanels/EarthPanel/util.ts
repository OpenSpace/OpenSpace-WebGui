export function addressUTF8(address: string): string {
  // Converts the string to utf-8 format removing any illegal characters
  // \x00-\x7F matches characters between index 0 and index 127, also replaces any
  // space, ',', and '.' characters
  // eslint-disable-next-line no-control-regex
  return address.replace(/[^\x00-\x7F]/g, '').replace(/[\s,.]/g, '_');
}
