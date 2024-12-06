import { PropsWithChildren } from 'react';
import { ActionIcon, Menu } from '@mantine/core';

import { SettingsIcon } from '@/icons/icons';

export function SettingsPopout({ children }: PropsWithChildren) {
  return (
    <Menu position={'right-start'} closeOnItemClick={false}>
      <Menu.Target>
        <ActionIcon>
          <SettingsIcon />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>{children}</Menu.Dropdown>
    </Menu>
  );
}

SettingsPopout.Item = Menu.Item;
