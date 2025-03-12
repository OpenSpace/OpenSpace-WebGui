import { Dispatch, SetStateAction } from 'react';
import { alpha, Box, Flex, Group } from '@mantine/core';

import { FileMenu } from './Menus/FileMenu';
import { FrictionMenu } from './Menus/FrictionMenu';
import { HelpMenu } from './Menus/HelpMenu';
import { ViewMenu } from './Menus/ViewMenu';
import { WindowsMenu } from './Menus/WindowsMenu';
import { ScrollBox } from '@/components/ScrollBox/ScrollBox';

interface TopMenuBarProps {
  visibleMenuItems: string[];
  setVisibleMenuItems: Dispatch<SetStateAction<string[]>>;
}

export function TopMenuBar({ visibleMenuItems, setVisibleMenuItems }: TopMenuBarProps) {
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
    </ScrollBox>
  );
}
