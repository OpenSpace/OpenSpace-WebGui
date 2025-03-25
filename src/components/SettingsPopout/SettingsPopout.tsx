import { PropsWithChildren } from 'react';
import { ActionIcon, MantineStyleProps, Menu } from '@mantine/core';

import { SettingsIcon } from '@/icons/icons';

interface Props {
  popoverWidth?: number;
  title?: string;
}

export function SettingsPopout({
  popoverWidth,
  title,
  children,
  ...styleProps
}: Props & PropsWithChildren & MantineStyleProps) {
  return (
    <Menu position={'right-start'} closeOnItemClick={false} width={popoverWidth}>
      <Menu.Target>
        <ActionIcon {...styleProps}>
          <SettingsIcon />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        {title && <Menu.Label>{title}</Menu.Label>}
        {children}
      </Menu.Dropdown>
    </Menu>
  );
}

SettingsPopout.Item = Menu.Item;
