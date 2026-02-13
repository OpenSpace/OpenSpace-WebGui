import { useTranslation } from 'react-i18next';
import { ActionIcon, Group, Tooltip } from '@mantine/core';

import { TruncatedText } from '@/components/TruncatedText/TruncatedText';
import { OpenInBrowserIcon, OpenWindowIcon } from '@/icons/icons';

interface Props {
  title: string;
  src: string;
  onNewWindow: (src: string, title: string) => void;
  onBrowser: (src: string, title: string) => void;
}

export function WebPanelListItem({ title, src, onNewWindow, onBrowser }: Props) {
  const { t } = useTranslation('panel-user');

  return (
    <Group mb={5} wrap={'nowrap'} key={`${src}${title}`}>
      <TruncatedText flex={1}>{title}</TruncatedText>
      <Group gap={'xs'}>
        <Tooltip label={t('add-buttons.new-window.tooltip')}>
          <ActionIcon
            onClick={() => onNewWindow(src, title)}
            aria-label={t('add-buttons.new-window.aria-label')}
          >
            <OpenWindowIcon />
          </ActionIcon>
        </Tooltip>
        <Tooltip label={t('add-buttons.browser.tooltip')}>
          <ActionIcon
            onClick={() => onBrowser(src, title)}
            aria-label={t('add-buttons.browser.aria-label')}
          >
            <OpenInBrowserIcon />
          </ActionIcon>
        </Tooltip>
      </Group>
    </Group>
  );
}
