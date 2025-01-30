import { Dispatch, SetStateAction } from 'react';
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

import { HelpMenu } from './HelpMenu';
import { LocaleSwitcher } from './LocaleSwitcher';
import { MenuWrapper } from './MenuWrapper';
import { NewWindowMenu } from './NewWindowMenu';
import { TaskBarMenuChoices } from './TaskBarMenuChoices';

interface TopMenuBarProps {
  visibleMenuItems: string[];
  setVisibleMenuItems: Dispatch<SetStateAction<string[]>>;
}

export function TopMenuBar({ visibleMenuItems, setVisibleMenuItems }: TopMenuBarProps) {
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
    <Group h={30} w={'100%'} bg={'var(--mantine-color-gray-filled)'}>
      <MenuWrapper>
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
      </MenuWrapper>

      <MenuWrapper closeOnItemClick={false}>
        <Menu.Target>
          <Button size={'xs'} color={'gray'}>
            Windows
          </Button>
        </Menu.Target>
        <Menu.Dropdown>
          <NewWindowMenu />
        </Menu.Dropdown>
      </MenuWrapper>

      <MenuWrapper>
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
      </MenuWrapper>
      <HelpMenu />
      <LocaleSwitcher />
    </Group>
  );
}
