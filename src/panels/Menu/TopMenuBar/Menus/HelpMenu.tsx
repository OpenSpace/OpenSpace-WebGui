import { Menu } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import { About } from '@/components/About/About';
import {
  BookIcon,
  FeedbackIcon,
  InformationCircleOutlineIcon,
  OpenInBrowserIcon,
  RouteIcon
} from '@/icons/icons';
import { useWebGuiUrl } from '@/util/networkingHooks';
import { GettingStartedPanel } from '@/windowmanagement/data/LazyLoads';
import { useWindowLayoutProvider } from '@/windowmanagement/WindowLayout/hooks';

import { TopBarMenuWrapper } from '../TopBarMenuWrapper';

export function HelpMenu() {
  const [showAbout, { open, close }] = useDisclosure(false);
  const webGuiUrl = useWebGuiUrl();

  const { addWindow } = useWindowLayoutProvider();

  function openGuiInBrowser() {
    window.open(webGuiUrl, '_blank');
  }

  function openGettingStartedTour() {
    addWindow(<GettingStartedPanel />, {
      id: 'gettingStartedTour',
      title: 'Getting Started Tour',
      floatPosition: { offsetY: 150, offsetX: 350, width: 600, height: 500 }
    });
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
        <Menu.Item
          leftSection={<RouteIcon style={{ transform: 'scale(-1)' }} />}
          onClick={openGettingStartedTour}
        >
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
