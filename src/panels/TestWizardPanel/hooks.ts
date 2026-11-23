import { useState } from 'react';

/**
 * Keeps a value that starts as the first known current value, but does not follow later
 * changes of it.
 *
 * @param current The current value, or `undefined` if it is not known yet
 * @param initial Value to start from instead of the current one, e.g., when editing
 * @returns The value, a setter, and a function that resets the value to the current one
 */
export function useResettableValue<T>(current: T | undefined, initial?: T) {
  const [value, setValue] = useState<T | undefined>(
    initial !== undefined ? initial : current
  );

  // `undefined` means not set, so clearing the value takes the current one again
  if (value === undefined && current !== undefined) {
    setValue(current);
  }

  function reset() {
    setValue(current);
  }

  return { value, setValue, reset };
}
