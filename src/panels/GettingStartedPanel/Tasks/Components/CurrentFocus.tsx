import { Text } from '@mantine/core';

import { useProperty } from '@/hooks/properties';
import { NavigationAnchorKey } from '@/util/keys';

export function CurrentFocus() {
  const [currentAnchor] = useProperty('StringProperty', NavigationAnchorKey);

  return <Text>Current focus: {currentAnchor ? currentAnchor : 'None'}</Text>;
}
