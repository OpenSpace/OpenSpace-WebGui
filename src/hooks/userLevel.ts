import { usePropertyValue } from '@/hooks/properties';
import { PropertyVisibilityNumber } from '@/types/enums';

export function useIsAdvancedUserLevel(): boolean {
  const userLevel = usePropertyValue(
    'OptionProperty',
    'OpenSpaceEngine.PropertyVisibility'
  );

  if (userLevel === undefined) {
    throw new Error('User level property is undefined');
  }

  return userLevel >= PropertyVisibilityNumber.AdvancedUser;
}
