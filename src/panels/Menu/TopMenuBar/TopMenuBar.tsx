import { alpha, Box, Flex, Group } from '@mantine/core';

import { ScrollBox } from '@/components/ScrollBox/ScrollBox';

import { FileMenu } from './Menus/FileMenu';
import { FrictionMenu } from './Menus/FrictionMenu';
import { HelpMenu } from './Menus/HelpMenu';
import { ViewMenu } from './Menus/ViewMenu';
import { WindowsMenu } from './Menus/WindowsMenu';

export function TopMenuBar() {
  return (
    <ScrollBox direction={'horizontal'}>
      <Flex
        gap={'xs'}
        h={30}
        bg={alpha('var(--mantine-color-dark-9)', 0.9)}
        justify={'space-between'}
        pb={'md'}
        style={{
          whiteSpace: 'nowrap'
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
    </ScrollBox>
  );
}
