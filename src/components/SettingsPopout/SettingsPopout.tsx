import { PropsWithChildren } from 'react';
import { ActionIcon, FloatingPosition, MantineStyleProps, Menu } from '@mantine/core';

import { SettingsIcon } from '@/icons/icons';

interface Props extends PropsWithChildren, MantineStyleProps {
  popoverWidth?: number;
  position?: FloatingPosition;
  title?: string;
}

export function SettingsPopout({
  popoverWidth,
  position,
  title,
  children,
  ...styleProps
}: Props) {
  return (
    <Menu
      position={position ?? 'right-start'}
      closeOnItemClick={false}
      width={popoverWidth}
      withArrow
    >
      <Menu.Target>
        <ActionIcon {...styleProps} aria-label={'Open settings'}>
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
