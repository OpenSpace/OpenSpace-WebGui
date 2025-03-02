import { Menu } from '@mantine/core';
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

import { TopBarMenuWrapper } from '../TopBarMenuWrapper';

export function HelpMenu() {
  const [showAbout, { open, close }] = useDisclosure(false);

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
      <About opened={showAbout} close={close} />

      <TopBarMenuWrapper targetTitle={'Help'}>
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
      </TopBarMenuWrapper>
    </>
  );
}
