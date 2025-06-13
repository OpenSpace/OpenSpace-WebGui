import { useEffect, useState } from 'react';

export function useTrackChange<T>(value: T | undefined) {
  const [startValue, setValue] = useState(value);

  useEffect(() => {
    if (startValue === undefined) {
      setValue(value);
    }
  }, [value, startValue]);

  if (Array.isArray(value) && Array.isArray(startValue)) {
    return (
      startValue !== undefined &&
      (startValue.length !== value.length || startValue.some((v, i) => v !== value[i]))
    );
  }
  return startValue !== undefined && startValue !== value;
}
