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
  return (
    <Group mb={5} wrap={'nowrap'} key={`${src}${title}`}>
      <TruncatedText flex={1}>{title}</TruncatedText>
      <Group gap={'xs'}>
        <Tooltip label={'Open in new window'}>
          <ActionIcon onClick={() => onNewWindow(src, title)}>
            <OpenWindowIcon />
          </ActionIcon>
        </Tooltip>
        <Tooltip label={'Open in browser'}>
          <ActionIcon onClick={() => onBrowser(src, title)}>
            <OpenInBrowserIcon />
          </ActionIcon>
        </Tooltip>
      </Group>
    </Group>
  );
}
