import { Text } from '@mantine/core';

import { NavigationAnchorKey } from '@/util/keys';
import { useProperty } from '@/hooks/properties';

export function CurrentFocus() {
  const [currentAnchor] = useProperty('StringProperty', NavigationAnchorKey);

  return <Text>Current focus: {currentAnchor ? currentAnchor : 'None'}</Text>;
}
