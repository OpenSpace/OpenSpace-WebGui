import { Menu, Text } from '@mantine/core';
import { modals } from '@mantine/modals';

import { useOpenSpaceApi } from '@/api/hooks';
import { useBoolProperty } from '@/hooks/properties';
import { ConsoleIcon, ExitAppIcon } from '@/icons/icons';

import { TopBarMenuWrapper } from '../TopBarMenuWrapper';

export function FileMenu() {
  const luaApi = useOpenSpaceApi();

  const [isConsoleVisible, setIsConsoleVisible] = useBoolProperty('LuaConsole.IsVisible');

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
      <Menu.Item onClick={toggleLuaConsole} leftSection={<ConsoleIcon />}>
        Toggle Console
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item onClick={toggleShutdown} leftSection={<ExitAppIcon />}>
        Quit OpenSpace
      </Menu.Item>
    </TopBarMenuWrapper>
  );
}
