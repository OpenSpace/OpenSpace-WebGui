import { alpha, Box, Flex, Group } from '@mantine/core';

import { FileMenu } from './Menus/FileMenu';
import { FrictionMenu } from './Menus/FrictionMenu';
import { HelpMenu } from './Menus/HelpMenu';
import { ViewMenu } from './Menus/ViewMenu';
import { WindowsMenu } from './Menus/WindowsMenu';

export function TopMenuBar() {
  return (
    <Flex
      gap={'xs'}
      h={30}
      bg={alpha('var(--mantine-color-dark-9)', 0.9)}
      justify={'space-between'}
      style={{
        whiteSpace: 'nowrap',
        overflowX: 'auto',
        overflowY: 'hidden'
      }}
      onWheel={(event) => {
        event.currentTarget.scrollLeft += event.deltaY;
      }}
    >
      <Group flex={'0 0 auto'}>
        <FileMenu />
        <WindowsMenu />
        <ViewMenu />
        <HelpMenu />
      </Group>

      <Box flex={'0 0 auto'}>
        <FrictionMenu />
      </Box>
    </Flex>
  );
}
