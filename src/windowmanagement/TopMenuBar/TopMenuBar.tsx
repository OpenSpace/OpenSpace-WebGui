import React, { Dispatch, SetStateAction } from 'react';
import { Button, Group, Kbd, Menu, Text } from '@mantine/core';
import { modals } from '@mantine/modals';

import { useGetBoolPropertyValue, useOpenSpaceApi } from '@/api/hooks';
import {
  AddFileIcon,
  ConsoleIcon,
  ExitAppIcon,
  SaveIcon,
  VisibilityIcon
} from '@/icons/icons';
import { WindowLayoutOptions } from '@/windowmanagement/WindowLayout/WindowLayout';

import { HelpMenu } from './HelpMenu';
import { NewWindowMenu } from './NewWindowMenu';
import { TaskBarMenuChoices } from './TaskBarMenuChoices';
import { TopMenu } from './TopMenu';

interface TopMenuBarProps {
  visibleMenuItems: string[];
  setVisibleMenuItems: Dispatch<SetStateAction<string[]>>;
  addWindow: (component: React.JSX.Element, options: WindowLayoutOptions) => void;
}

export function TopMenuBar({
  visibleMenuItems,
  setVisibleMenuItems,
  addWindow
}: TopMenuBarProps) {
  const luaApi = useOpenSpaceApi();

  const [isConsoleVisible, setIsConsoleVisible] =
    useGetBoolPropertyValue('LuaConsole.IsVisible');

  function toggleLuaConsole() {
    setIsConsoleVisible(!isConsoleVisible);
  }

  function toggleShutdown() {
    return modals.openConfirmModal({
      title: 'Confirm action',
      children: <Text>Are you sure you want to quit OpenSpace?</Text>,
      labels: { confirm: 'Quit', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: () => luaApi?.toggleShutdown()
    });
  }

  return (
    <Group
      style={{
        height: 30,
        width: '100%',
        backgroundColor: 'var(--mantine-color-gray-filled)'
      }}
    >
      <TopMenu>
        <Menu.Target>
          <Button size={'xs'} color={'gray'}>
            File
          </Button>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item leftSection={<AddFileIcon />}>Add Asset</Menu.Item>
          <Menu.Item
            onClick={toggleLuaConsole}
            leftSection={<ConsoleIcon />}
            rightSection={<Kbd>~</Kbd>}
          >
            Toggle Console
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item
            onClick={toggleShutdown}
            leftSection={<ExitAppIcon />}
            rightSection={<Kbd>Esc</Kbd>}
          >
            Quit OpenSpace
          </Menu.Item>
        </Menu.Dropdown>
      </TopMenu>

      <TopMenu closeOnItemClick={false}>
        <Menu.Target>
          <Button size={'xs'} color={'gray'}>
            Windows
          </Button>
        </Menu.Target>
        <Menu.Dropdown>
          <NewWindowMenu addWindow={addWindow} />
        </Menu.Dropdown>
      </TopMenu>

      <TopMenu>
        <Menu.Target>
          <Button size={'xs'} color={'gray'}>
            View
          </Button>
        </Menu.Target>
        <Menu.Dropdown>
          <TaskBarMenuChoices
            visibleMenuItems={visibleMenuItems}
            setVisibleMenuItems={setVisibleMenuItems}
          />
          <Menu.Item leftSection={<SaveIcon />}>Load/Save Layout</Menu.Item>
          <Menu.Divider />
          <Menu.Item leftSection={<VisibilityIcon />}>User Visibility</Menu.Item>
        </Menu.Dropdown>
      </TopMenu>

      <HelpMenu />
    </Group>
  );
}
