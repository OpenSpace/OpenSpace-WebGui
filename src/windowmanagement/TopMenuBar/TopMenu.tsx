import {
  ArrowPosition,
  FloatingAxesOffsets,
  FloatingPosition,
  Menu,
  MenuProps
} from '@mantine/core';
import { PropsWithChildren } from 'react';

interface Props extends MenuProps, PropsWithChildren {
  menuItemTabIndex?: -1 | 0;
  position?: FloatingPosition;
  offset?: number | FloatingAxesOffsets;
  withArrow?: boolean;
  arrowPosition?: ArrowPosition;
}

export function TopMenu({
  menuItemTabIndex = 0,
  position = 'bottom-start',
  offset = 8,
  withArrow = true,
  arrowPosition = 'center',
  children,
  ...props
}: Props) {
  return (
    <Menu
      position={position}
      menuItemTabIndex={menuItemTabIndex}
      offset={offset}
      withArrow
      arrowPosition={arrowPosition}
      {...props}
    >
      {children}
    </Menu>
  );
}
