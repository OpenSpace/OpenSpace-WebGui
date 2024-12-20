import { Button, Kbd, Menu, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import {
  useGetBoolPropertyValue,
  useGetIntPropertyValue,
  useGetStringPropertyValue,
  useOpenSpaceApi
} from '@/api/hooks';
import { About } from '@/components/About/About';
import {
  BookIcon,
  ConsoleIcon,
  ExitAppIcon,
  FeedbackIcon,
  InformationCircleOutlineIcon,
  OpenInBrowserIcon,
  RouteIcon
} from '@/icons/icons';
import { modals } from '@mantine/modals';

export function HelpMenu() {
  const luaApi = useOpenSpaceApi();
  const [opened, { open, close }] = useDisclosure(false);
  const [isConsoleVisible, setIsConsoleVisible] =
    useGetBoolPropertyValue('LuaConsole.IsVisible');
  const [portProperty] = useGetIntPropertyValue('Modules.WebGui.Port');
  const [addressProperty] = useGetStringPropertyValue('Modules.WebGui.Address');

  function toggleLuaConsole() {
    setIsConsoleVisible(!isConsoleVisible);
  }

  function openGuiInBrowser() {
    const port = portProperty ?? 4680;
    const address = addressProperty ?? 'localhost';

    const link = `http://${address}:${port}`;
    window.open(link, '_blank');
  }

  function toggleShutdown() {
    return modals.openConfirmModal({
      title: 'Confirm action',
      children: <Text>Are you sure you want to quit OpenSpace? </Text>,
      labels: { confirm: 'Quit', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: () => luaApi?.toggleShutdown()
    });
  }

  return (
    <>
      <About opened={opened} close={close} />

      <Menu position={'bottom-start'} offset={4} withArrow arrowPosition={'center'}>
        <Menu.Target>
          <Button size={'xs'} color={'gray'}>
            Help
          </Button>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item
            component={'a'}
            href={
              'https://www.youtube.com/playlist?list=PLzXWit_1TXsu23I8Nh2WZhN9msWG_ZbnV'
            }
            target={'_blank'}
            leftSection={<BookIcon />}
          >
            Open Web Tutorials
          </Menu.Item>
          <Menu.Item leftSection={<RouteIcon style={{ transform: 'scale(-1)' }} />}>
            Open Getting Started Tour
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item
            component={'a'}
            href={'http://data.openspaceproject.com/feedback'}
            target={'_blank'}
            leftSection={<FeedbackIcon />}
          >
            Send Feedback
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item
            onClick={toggleLuaConsole}
            leftSection={<ConsoleIcon />}
            rightSection={<Kbd>~</Kbd>}
          >
            Toggle Console
          </Menu.Item>
          <Menu.Item onClick={openGuiInBrowser} leftSection={<OpenInBrowserIcon />}>
            Open GUI in Browser
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item
            onClick={toggleShutdown}
            leftSection={<ExitAppIcon />}
            rightSection={<Kbd>Esc</Kbd>}
          >
            Quit OpenSpace
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item onClick={open} leftSection={<InformationCircleOutlineIcon />}>
            About
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </>
  );
}
