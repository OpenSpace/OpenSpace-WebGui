import { Text } from '@mantine/core';

import { useStringProperty } from '@/hooks/properties';
import { NavigationAnchorKey } from '@/util/keys';

export function CurrentFocus() {
  const [currentAnchor] = useStringProperty(NavigationAnchorKey);

  return <Text>Current focus: {currentAnchor ? currentAnchor : 'None'}</Text>;
}
