import { PropsWithChildren, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActionIcon, Popover } from '@mantine/core';

import { ScrollBox } from '@/components/ScrollBox/ScrollBox';
import { InformationIcon } from '@/icons/icons';
import styles from '@/theme/global.module.css';

interface Props {
  w?: number;
  h?: number;
}

export function InfoBox({ children, w = 320, h = 400 }: Props & PropsWithChildren) {
  const { t } = useTranslation('components', { keyPrefix: 'info-box' });

  const [opened, setOpened] = useState(false);

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
        <ScrollBox mah={h}>{children}</ScrollBox>
      </Popover.Dropdown>
    </Popover>
  );
}
