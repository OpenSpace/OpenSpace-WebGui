import { Dispatch, SetStateAction } from 'react';
import { Button, Group, Menu } from '@mantine/core';

import { WindowLayoutOptions } from './WindowLayout/WindowLayout';
import { HelpMenu } from './HelpMenu';
import { NewWindowMenu } from './NewWindowMenu';
import { TaskBarMenuChoices } from './TaskBarMenuChoices';

interface TopMenuBarProps {
  visibleMenuItems: string[];
  setVisibleMenuItems: Dispatch<SetStateAction<string[]>>;
  addWindow: (component: JSX.Element, options: WindowLayoutOptions) => void;
}

export function TopMenuBar({
  visibleMenuItems,
  setVisibleMenuItems,
  addWindow
}: TopMenuBarProps) {
  return (
    <Group
      style={{
        height: 30,
        width: '100%',
        backgroundColor: 'var(--mantine-color-gray-filled)'
      }}
    >
      <Button size={'xs'} color={'gray'}>
        {'Asset\r'}
      </Button>

      <Menu position={'bottom-start'} offset={4} withArrow arrowPosition={'center'}>
        <Menu.Target>
          <Button size={'xs'} color={'gray'}>
            {'Settings\r'}
          </Button>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item>Settings</Menu.Item>
        </Menu.Dropdown>
      </Menu>

      <Menu position={'bottom-start'} offset={4} withArrow arrowPosition={'center'}>
        <Menu.Target>
          <Button size={'xs'} color={'gray'}>
            {'View\r'}
          </Button>
        </Menu.Target>
        <Menu.Dropdown>
          <TaskBarMenuChoices
            visibleMenuItems={visibleMenuItems}
            setVisibleMenuItems={setVisibleMenuItems}
          />
          <NewWindowMenu addWindow={addWindow} />
          <Menu.Item>Load/Save Layout</Menu.Item>
        </Menu.Dropdown>
      </Menu>

      <HelpMenu />
    </Group>
  );
}
