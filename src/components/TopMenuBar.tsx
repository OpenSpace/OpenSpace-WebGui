import { Dispatch, SetStateAction } from 'react';
import { Button, Group, Menu } from '@mantine/core';

import { TaskBarMenuChoices } from './TaskBarMenuChoices';

interface TopMenuBarProps {
  visibleMenuItems: string[];
  setVisibleMenuItems: Dispatch<SetStateAction<string[]>>;
}

export function TopMenuBar({ visibleMenuItems, setVisibleMenuItems }: TopMenuBarProps) {
  return (
    <Group
      style={{
        height: 30,
        width: '100%',
        backgroundColor: 'var(--mantine-color-gray-filled)'
      }}
    >
      <Button size={'xs'} color="gray">
        Asset
      </Button>
      <Menu position={'bottom-start'} offset={4} withArrow arrowPosition={'center'}>
        <Menu.Target>
          <Button size={'xs'} color="gray">
            Settings
          </Button>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item>Kebab menu</Menu.Item>
          <Menu.Divider />
          <Menu.Item>Settings</Menu.Item>
        </Menu.Dropdown>
      </Menu>

      <Menu position={'bottom-start'} offset={4} withArrow arrowPosition={'center'}>
        <Menu.Target>
          <Button size={'xs'} color="gray">
            View
          </Button>
        </Menu.Target>
        <Menu.Dropdown>
          <TaskBarMenuChoices
            visibleMenuItems={visibleMenuItems}
            setVisibleMenuItems={setVisibleMenuItems}
          />
          <Menu.Item>Windows</Menu.Item>
          <Menu.Item>Load/Save Layout</Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Group>
  );
}
