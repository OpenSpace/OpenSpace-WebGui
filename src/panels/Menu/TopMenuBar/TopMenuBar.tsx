import { Dispatch, SetStateAction } from 'react';
import { alpha, Group } from '@mantine/core';

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
    <Group
      gap={'xs'}
      h={30}
      bg={alpha('var(--mantine-color-dark-5)', 0.9)}
      pos={'relative'}
    >
      <FileMenu />
      <WindowsMenu />
      <ViewMenu
        visibleMenuItems={visibleMenuItems}
        setVisibleMenuItems={setVisibleMenuItems}
      />
      <HelpMenu />
      <FrictionMenu />
    </Group>
  );
}
