import { Button, Menu } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import { useGetIntPropertyValue, useGetStringPropertyValue } from '@/api/hooks';
import { About } from '@/components/About/About';
import {
  BookIcon,
  FeedbackIcon,
  InformationCircleOutlineIcon,
  OpenInBrowserIcon,
  RouteIcon
} from '@/icons/icons';

export function HelpMenu() {
  const [opened, { open, close }] = useDisclosure(false);

  const [portProperty] = useGetIntPropertyValue('Modules.WebGui.Port');
  const [addressProperty] = useGetStringPropertyValue('Modules.WebGui.Address');

  function openGuiInBrowser() {
    const port = portProperty ?? 4680;
    const address = addressProperty ?? 'localhost';

    const link = `http://${address}:${port}`;
    window.open(link, '_blank');
  }

  return (
    <>
      <About opened={opened} close={close} />

      <Menu
        position={'bottom-start'}
        menuItemTabIndex={0}
        offset={4}
        withArrow
        arrowPosition={'center'}
      >
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

          <Menu.Item onClick={openGuiInBrowser} leftSection={<OpenInBrowserIcon />}>
            Open GUI in Browser
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
