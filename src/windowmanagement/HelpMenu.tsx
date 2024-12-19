import { Anchor, Button, Grid, Image, Menu, Modal, Text, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import { useOpenSpaceApi } from '@/api/hooks';
import {
  BookIcon,
  ConsoleIcon,
  ExitAppIcon,
  FeedbackIcon,
  InformationCircleOutlineIcon,
  OpenInBrowserIcon,
  RouteIcon
} from '@/icons/icons';
import { useAppSelector } from '@/redux/hooks';

export function HelpMenu() {
  const [opened, { open, close }] = useDisclosure(false);
  const luaApi = useOpenSpaceApi();
  const openSpaceVersion = useAppSelector((state) => state.version.openSpaceVersion);

  async function toggleLuaConsole() {
    if (!luaApi) {
      return;
    }
    const visible = (await luaApi.propertyValue('LuaConsole.IsVisible')) as
      | boolean
      | undefined;
    luaApi.setPropertyValueSingle('LuaConsole.IsVisible', !visible);
  }

  async function openGuiInBrowser() {
    if (!luaApi) {
      return;
    }
    const portProperty = (await luaApi.propertyValue('Modules.WebGui.Port')) as
      | number
      | undefined;
    const port = portProperty ?? 4670; // TODO: Change this to correct port when hosted
    const addressProperty = (await luaApi.propertyValue('Modules.WebGui.Address')) as
      | string
      | undefined;
    const address = addressProperty ?? 'localhost';

    const link = `http://${address}:${port}`;
    window.open(link, '_blank');
  }

  function toggleShutdown() {
    luaApi?.toggleShutdown();
  }

  function osVersionNumber(): React.JSX.Element {
    if (!openSpaceVersion) {
      return <Text>Fetching OpenSpace version...</Text>;
    }

    function formatVersion(version: {
      major: number;
      minor: number;
      patch: number;
    }): string {
      return version.major !== 255 && version.minor !== 255 && version.patch !== 255
        ? `${version.major}.${version.minor}.${version.patch}`
        : 'Custom';
    }

    return <Text>OpenSpave version: {formatVersion(openSpaceVersion)}</Text>;
  }

  return (
    <>
      <Modal opened={opened} onClose={close} title={'About'} size={'40%'}>
        <Grid>
          <Grid.Col span={4}>
            <Image src={'openspace-logo.png'} alt={'OpenSpace logo'} w={'100%'} />
          </Grid.Col>
          <Grid.Col span={8}>
            <Title order={1}>OpenSpace</Title>

            <Text>
              OpenSpace is open source interactive data visualization software designed to
              visualize the entire known universe and portray our ongoing efforts to
              investigate the cosmos.
            </Text>
            {osVersionNumber()}
            <Text>
              &copy; 2014 - {new Date().getFullYear()} OpenSpace Development Team
            </Text>
            <Anchor href={'https://www.openspaceproject.com/'} target={'_blank'}>
              openspaceproject.com
            </Anchor>
          </Grid.Col>
        </Grid>
      </Modal>

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
          <Menu.Item onClick={toggleLuaConsole} leftSection={<ConsoleIcon />}>
            Toggle Console
          </Menu.Item>
          <Menu.Item onClick={openGuiInBrowser} leftSection={<OpenInBrowserIcon />}>
            Open GUI in Browser
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item onClick={toggleShutdown} leftSection={<ExitAppIcon />}>
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
