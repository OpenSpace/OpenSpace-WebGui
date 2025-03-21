import { useState } from 'react';
import { ActionIcon, Tooltip } from '@mantine/core';

import { InformationIcon } from '@/icons/icons';

interface Props {
  text: React.ReactNode;
  w?: number;
}

export function InfoBox({ text, w = 220 }: Props) {
  const [opened, setOpened] = useState(false);

  return (
    <Tooltip
      label={text}
      multiline
      maw={w}
      offset={{ mainAxis: 5, crossAxis: 100 }}
      opened={opened}
      transitionProps={{ duration: 0, enterDelay: 0 }}
    >
      <ActionIcon
        radius={'xl'}
        size={'xs'}
        aria-label={"More information"}
        onClick={() => setOpened(!opened)}
      >
        <InformationIcon />
      </ActionIcon>
    </Tooltip>
  );
}
