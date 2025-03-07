import { Text } from '@mantine/core';

import { useGetStringPropertyValue } from '@/api/hooks';
import { NavigationAnchorKey } from '@/util/keys';

export function CurrentFocus() {
  const [currentAnchor] = useGetStringPropertyValue(NavigationAnchorKey);

  return <Text>Current focus: {currentAnchor ? currentAnchor : 'None'}</Text>;
}
