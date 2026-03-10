import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Menu } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import { About } from '@/components/About/About';
import { QRCode } from '@/components/QRCode/QRCode';
import {
  BookIcon,
  BrowserIcon,
  FeedbackIcon,
  HomeIcon,
  InformationCircleOutlineIcon,
  OpenInBrowserIcon,
  PhoneIcon
} from '@/icons/icons';
import { IconSize } from '@/types/enums';
import { useWebGuiUrl } from '@/util/networkingHooks';
import { useWindowLayoutProvider } from '@/windowmanagement/WindowLayout/hooks';

import { useMenuItemsByGroup } from '../../hooks';
import { TopBarMenuWrapper } from '../TopBarMenuWrapper';

export function HelpMenu() {
  const { t } = useTranslation('menu', { keyPrefix: 'help-menu' });

  const [showAbout, { open, close }] = useDisclosure(false);
  const [showQRCode, { open: openQRCode, close: closeQRCode }] = useDisclosure(false);
  const webGuiUrl = useWebGuiUrl();
  const navigation = useNavigate();

  const { menuItemsByGroup } = useMenuItemsByGroup(['Help']);
  const { addWindow } = useWindowLayoutProvider();

  function openGuiInBrowser() {
    window.open(`${webGuiUrl}/gui`, '_blank');
  }

  return (
    <>
      <About opened={showAbout} close={close} />
      <QRCode opened={showQRCode} close={closeQRCode} />

      <TopBarMenuWrapper targetTitle={'Help'}>
        <Menu.Item
          component={'a'}
          href={
            'https://www.youtube.com/playlist?list=PLzXWit_1TXsu23I8Nh2WZhN9msWG_ZbnV'
          }
          target={'_blank'}
          leftSection={<BookIcon />}
          rightSection={<OpenInBrowserIcon />}
          aria-description={t('external-tab-aria-label')}
        >
          {t('tutorials')}
        </Menu.Item>
        <Menu.Item onClick={() => navigation('/routes')} leftSection={<HomeIcon />}>
          {t('routes')}
        </Menu.Item>

        <Menu.Divider />
        {menuItemsByGroup.Help.map((item) => (
          <Menu.Item
            key={item.componentID}
            leftSection={item.renderIcon?.(IconSize.xs)}
            onClick={() =>
              addWindow(item.content, {
                title: item.title,
                position: item.preferredPosition,
                id: item.componentID,
                floatPosition: item.floatPosition
              })
            }
          >
            {item.title}
          </Menu.Item>
        ))}

        <Menu.Divider />
        <Menu.Item
          component={'a'}
          href={'http://data.openspaceproject.com/feedback'}
          target={'_blank'}
          leftSection={<FeedbackIcon />}
          rightSection={<OpenInBrowserIcon />}
          aria-description={t('external-tab-aria-label')}
        >
          {t('send-feedback')}
        </Menu.Item>
        <Menu.Divider />

        <Menu.Item
          onClick={openGuiInBrowser}
          leftSection={<BrowserIcon />}
          rightSection={<OpenInBrowserIcon />}
          aria-description={t('external-tab-aria-label')}
        >
          {t('open-gui')}
        </Menu.Item>
        <Menu.Item onClick={openQRCode} leftSection={<PhoneIcon />}>
          {t('qrcode')}
        </Menu.Item>

        <Menu.Divider />
        <Menu.Item onClick={open} leftSection={<InformationCircleOutlineIcon />}>
          {t('about')}
        </Menu.Item>
      </TopBarMenuWrapper>
    </>
  );
}
