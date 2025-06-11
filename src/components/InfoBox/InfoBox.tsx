import { PropsWithChildren, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActionIcon, Popover } from '@mantine/core';

import { InformationIcon } from '@/icons/icons';
import styles from '@/theme/global.module.css';

interface Props {
  w?: number;
}

export function InfoBox({ children, w = 320 }: Props & PropsWithChildren) {
  const [opened, setOpened] = useState(false);
  const { t } = useTranslation('components', { keyPrefix: 'info-box' });

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
          aria-label={t('aria-label')}
          onClick={() => setOpened(!opened)}
        >
          <InformationIcon />
        </ActionIcon>
      </Popover.Target>

      <Popover.Dropdown maw={w} className={styles.selectable}>
        {children}
      </Popover.Dropdown>
    </Popover>
  );
}
