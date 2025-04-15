import { Kbd, Menu, Text } from '@mantine/core';
import { modals } from '@mantine/modals';

import { useOpenSpaceApi } from '@/api/hooks';
import { ConsoleIcon, ExitAppIcon } from '@/icons/icons';

import { TopBarMenuWrapper } from '../TopBarMenuWrapper';
import { useProperty } from '@/types/hooks';

export function FileMenu() {
  const luaApi = useOpenSpaceApi();

  const [isConsoleVisible, setIsConsoleVisible] = useProperty(
    'BoolProperty',
    'LuaConsole.IsVisible'
  );

  function toggleLuaConsole() {
    setIsConsoleVisible(!isConsoleVisible);
  }

  function toggleShutdown() {
    return modals.openConfirmModal({
      title: 'Confirm action',
      children: <Text>Are you sure you want to quit OpenSpace?</Text>,
      labels: { confirm: 'Quit', cancel: 'Cancel' },
      confirmProps: { color: 'red', variant: 'filled' },
      onConfirm: () => luaApi?.toggleShutdown()
    });
  }

  return (
    <TopBarMenuWrapper targetTitle={'File'}>
      <Menu.Item
        onClick={toggleLuaConsole}
        leftSection={<ConsoleIcon />}
        rightSection={<Kbd>~</Kbd>}
      >
        Toggle Console
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item onClick={toggleShutdown} leftSection={<ExitAppIcon />}>
        Quit OpenSpace
      </Menu.Item>
    </TopBarMenuWrapper>
  );
}
