import { useState } from 'react';

/**
 * Keeps a value that starts as the first known current value, but does not follow later
 * changes of it.
 *
 * @param current The current value, or `undefined` if it is not known yet
 * @returns The value, a setter, and a function that resets the value to the current one
 */
export function useResettableValue<T>(current: T | undefined) {
  const [value, setValue] = useState<T | undefined>(current);

  // `undefined` means not set, so clearing the value takes the current one again
  if (value === undefined && current !== undefined) {
    setValue(current);
  }

  function reset() {
    setValue(current);
  }

  return { value, setValue, reset };
}
