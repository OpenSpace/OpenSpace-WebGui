import { Dispatch, SetStateAction } from 'react';
import { alpha, Box, Flex, Group } from '@mantine/core';

import { FileMenu } from './Menus/FileMenu';
import { FrictionMenu } from './Menus/FrictionMenu';
import { HelpMenu } from './Menus/HelpMenu';
import { ViewMenu } from './Menus/ViewMenu';
import { WindowsMenu } from './Menus/WindowsMenu';

interface TopMenuBarProps {
  visibleMenuItems: string[];
  setVisibleMenuItems: Dispatch<SetStateAction<string[]>>;
}

export function TopMenuBar({ visibleMenuItems, setVisibleMenuItems }: TopMenuBarProps) {
  return (
    <Flex
      gap={'xs'}
      h={30}
      bg={alpha('var(--mantine-color-dark-5)', 0.9)}
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
        <ViewMenu
          visibleMenuItems={visibleMenuItems}
          setVisibleMenuItems={setVisibleMenuItems}
        />

        <HelpMenu />
      </Group>

      <Box flex={'0 0 auto'}>
        <FrictionMenu />
      </Box>
    </Flex>
  );
}
