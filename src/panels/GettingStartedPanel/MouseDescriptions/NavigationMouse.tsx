import { Group, Text } from '@mantine/core';

import { Mouse } from './Mouse';

export function NavigationMouse() {
  return (
    <Group>
      <Text flex={1} c={'dimmed'} fs={'italic'}>
        The latitude and longitude are displayed at the top left corner of the screen.
        Left click and drag to orbit.
      </Text>
      <Mouse mouseClick={'left'} arrowDir={'horizontal'} />
    </Group>
  );
}
