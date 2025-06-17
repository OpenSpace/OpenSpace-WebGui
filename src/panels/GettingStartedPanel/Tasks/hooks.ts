import { useEffect, useState } from 'react';

export function useTrackChange<T>(value: T | undefined) {
  const [startValue, setValue] = useState(value);

  useEffect(() => {
    if (startValue === undefined) {
      setValue(value);
    }
  }, [value, startValue]);

  // If we have not initialized the startValue, we are still in initialization phase
  // so we don't want to detect changes yet
  if (startValue === undefined) {
    return false;
  }

  if (Array.isArray(value) && Array.isArray(startValue)) {
    return (
      // If the arrays are of different lengths or if any element is different
      startValue.length !== value.length || startValue.some((v, i) => v !== value[i])
    );
  }
  return startValue !== value;
}
