export function camelCaseToRegularText(camelCase: string): string {
  return camelCase
    .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space between lowercase and uppercase letters
    .replace(/^./, (str) => str.toUpperCase()); // Capitalize the first letter
}
