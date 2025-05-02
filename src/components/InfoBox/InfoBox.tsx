import { PropsWithChildren, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActionIcon, Popover } from '@mantine/core';

import { InformationIcon } from '@/icons/icons';

interface Props {
  w?: number;
}

export function InfoBox({ children, w = 320 }: Props & PropsWithChildren) {
  const [opened, setOpened] = useState(false);
  const { t } = useTranslation('components');

  return (
    <Popover
      opened={opened}
      onDismiss={() => setOpened(false)}
      position={'top'}
      trapFocus
      withArrow
      offset={{ mainAxis: 5, crossAxis: 100 }}
    >
      <Popover.Target>
        <ActionIcon
          radius={'xl'}
          size={'xs'}
          aria-label={t('info-box.aria-label')}
          onClick={() => setOpened(!opened)}
        >
          <InformationIcon />
        </ActionIcon>
      </Popover.Target>

      <Popover.Dropdown maw={w}>{children}</Popover.Dropdown>
    </Popover>
  );
}
