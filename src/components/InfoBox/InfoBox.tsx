import { useState } from 'react';
import { ActionIcon, Code, Group, Popover } from '@mantine/core';

import { InformationIcon } from '@/icons/icons';

import { CopyToClipboardButton } from '../CopyToClipboardButton/CopyToClipboardButton';

interface Props {
  text: React.ReactNode;
  uri?: string;
  w?: number;
}

export function InfoBox({ text, uri, w = 220 }: Props) {
  const [opened, setOpened] = useState(false);

  return (
    <Popover
      opened={opened}
      onDismiss={() => setOpened(false)}
      position={"top"}
      withArrow
      offset={{ mainAxis: 5, crossAxis: 100 }}
    >
      <Popover.Target>
        <ActionIcon
          radius={'xl'}
          size={'xs'}
          aria-label={'More information'}
          onClick={() => setOpened(!opened)}
        >
          <InformationIcon />
        </ActionIcon>
      </Popover.Target>

      <Popover.Dropdown maw={w}>
        {text}
        {uri && (
          <Group pt={'sm'}>
            <Code>Copy URI:</Code>
            <CopyToClipboardButton value={uri} />
          </Group>
        )}
      </Popover.Dropdown>
    </Popover>
  );
}
