import { useCallback, useState } from 'react';

export function useKeySettings<T>(keys: Partial<Record<keyof T, boolean>>) {
  const [enabledKeys, setEnabledKeys] = useState<Record<keyof T, boolean>>(
    Object.entries(keys).reduce(
      (acc, [key, value]) => {
        acc[key as keyof T] = value as boolean; // Use provided value, otherwise default to true
        return acc;
      },
      {} as Record<keyof T, boolean>
    )
  );

  const toggleKey = useCallback(
    (key: keyof T, enabled: boolean) => {
      if (key in keys) {
        setEnabledKeys((prev) => ({ ...prev, [key]: enabled }));
      }
    },
    [keys]
  );

  const selectedKeys = Object.entries(enabledKeys)
    .filter(([, value]) => value)
    .map(([key]) => key) as Array<keyof T>;

  return { allowedKeys: enabledKeys, toggleKey, selectedKeys } as const;
}
