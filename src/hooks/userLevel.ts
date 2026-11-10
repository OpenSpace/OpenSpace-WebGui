import { usePropertyValue } from '@/hooks/properties';
import { PropertyVisibilityNumber } from '@/types/enums';

/**
 * @returns The current property visibility level (see `PropertyVisibilityNumber`), or
 * `undefined` if it is not yet known.
 */
export function usePropertyVisibilityLevel(): number | undefined {
  return usePropertyValue('OptionProperty', 'OpenSpaceEngine.PropertyVisibility');
}

/**
 * @param current The current visibility level, if known
 * @param level The minimum visibility level to check for
 * @returns True if `current` is at least `level`. False if it is lower or not yet known.
 */
export function isVisibilityLevelMet(
  current: number | undefined,
  level: keyof typeof PropertyVisibilityNumber
): boolean {
  return current !== undefined && current >= PropertyVisibilityNumber[level];
}

/**
 * @param level The minimum visibility level to check for
 * @returns True if the current visibility level is at least `level`. False if it is
 * lower or not yet known.
 */
export function useIsVisibilityLevel(
  level: keyof typeof PropertyVisibilityNumber
): boolean {
  return isVisibilityLevelMet(usePropertyVisibilityLevel(), level);
}
