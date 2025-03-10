import { Box, Group, Text } from '@mantine/core';

import { Mouse } from './Mouse';

export function AltitudeMouse() {
  return (
    <Group>
      <Box flex={2}>
        <Text c={'dimmed'} fs={'italic'}>
          The altitude is displayed at the top left corner of the screen. Right click and
          drag to go closer or further away.
        </Text>
      </Box>
      <Box flex={1}>
        <Mouse mouseClick={'right'} arrowDir={'vertical'} />
      </Box>
    </Group>
  );
}
