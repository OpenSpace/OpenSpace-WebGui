import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Menu } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import { About } from '@/components/About/About';
import {
  BookIcon,
  FeedbackIcon,
  HomeIcon,
  InformationCircleOutlineIcon,
  OpenInBrowserIcon,
  OpenWindowIcon,
  RouteIcon
} from '@/icons/icons';
import { useWebGuiUrl } from '@/util/networkingHooks';
import { GettingStartedPanel } from '@/windowmanagement/data/LazyLoads';
import { useWindowLayoutProvider } from '@/windowmanagement/WindowLayout/hooks';

import { TopBarMenuWrapper } from '../TopBarMenuWrapper';

export function HelpMenu() {
  const [showAbout, { open, close }] = useDisclosure(false);
  const webGuiUrl = useWebGuiUrl();
  const navigation = useNavigate();

  const { addWindow } = useWindowLayoutProvider();
  const { t } = useTranslation('menu', { keyPrefix: 'help-menu' });

  function openGuiInBrowser() {
    window.open(`${webGuiUrl}/gui`, '_blank');
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
          rightSection={<OpenWindowIcon />}
          aria-description={t('external-tab-aria-label')}
        >
          {t('tutorials')}
        </Menu.Item>
        <Menu.Item
          onClick={openGettingStartedTour}
          leftSection={<RouteIcon style={{ transform: 'scale(-1)' }} />}
        >
          {t('getting-started')}
        </Menu.Item>
        <Menu.Item onClick={() => navigation('/routes')} leftSection={<HomeIcon />}>
          {t('routes')}
        </Menu.Item>

        <Menu.Divider />
        <Menu.Item
          component={'a'}
          href={'http://data.openspaceproject.com/feedback'}
          target={'_blank'}
          leftSection={<FeedbackIcon />}
          rightSection={<OpenWindowIcon />}
          aria-description={t('external-tab-aria-label')}
        >
          {t('send-feedback')}
        </Menu.Item>
        <Menu.Divider />

        <Menu.Item
          onClick={openGuiInBrowser}
          leftSection={<OpenInBrowserIcon />}
          rightSection={<OpenWindowIcon />}
          aria-description={t('external-tab-aria-label')}
        >
          {t('open-gui')}
        </Menu.Item>

        <Menu.Divider />
        <Menu.Item onClick={open} leftSection={<InformationCircleOutlineIcon />}>
          {t('about')}
        </Menu.Item>
      </TopBarMenuWrapper>
    </>
  );
}
