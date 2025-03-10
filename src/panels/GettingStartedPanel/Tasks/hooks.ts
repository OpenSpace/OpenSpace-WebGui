import { useEffect, useState } from 'react';

export function useTrackChange<T>(value: T | undefined) {
  const [startValue, setValue] = useState(value);

  useEffect(() => {
    if (startValue === undefined) {
      setValue(value);
    }
  }, [value, startValue]);

  return startValue !== undefined && startValue !== value;
}
