import { useCallback, useState } from 'react';

/**
 * A custom React hook that manages a set of keys and their enabled/disabled states.
 *
 * @template T - The type of the object whose keys are being managed.
 *
 * @param keys - An object containing a partial mapping of keys of type `T` to boolean values,
 *               indicating whether each key is enabled or disabled by default.
 *
 * @returns An object containing:
 * - `allowedKeys`: The current state of the keys and their enabled/disabled statuses.
 * - `toggleKey`: A function to toggle the enabled/disabled state of a specific key.
 * - `selectedKeys`: An array of keys that are currently enabled.
 *
 * @example
 * ```typescript
 * interface Settings {
 *   darkMode: boolean;
 *   notifications: boolean;
 *   autoSave: boolean;
 * }
 *
 * const { allowedKeys, toggleKey, selectedKeys } = useKeySettings<Settings>({
 *   darkMode: true,
 *   notifications: false,
 * });
 *
 * toggleKey('notifications', true); // Enables the 'notifications' key.
 * console.log(selectedKeys); // Outputs: ['darkMode', 'notifications']
 * ```
 */
export function useSearchKeySettings<T>(keys: Partial<Record<keyof T, boolean>>) {
  const [allowedSearchKeys, setAllowedSearchKeys] =
    useState<Partial<Record<keyof T, boolean>>>(keys);

  const toggleSearchKey = useCallback(
    (key: keyof T, enabled: boolean) => {
      if (key in keys) {
        setAllowedSearchKeys((prev) => ({ ...prev, [key]: enabled }));
      }
    },
    [keys]
  );

  const selectedSearchKeys = Object.entries(allowedSearchKeys)
    .filter(([, value]) => value)
    .map(([key]) => key) as Array<keyof T>;

  return {
    allowedSearchKeys,
    toggleSearchKey,
    selectedSearchKeys
  } as const;
}
