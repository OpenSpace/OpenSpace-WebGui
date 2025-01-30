import { PropsWithChildren } from 'react';
import {
  ArrowPosition,
  FloatingAxesOffsets,
  FloatingPosition,
  Menu,
  MenuProps
} from '@mantine/core';

interface Props extends MenuProps, PropsWithChildren {
  menuItemTabIndex?: -1 | 0;
  position?: FloatingPosition;
  offset?: number | FloatingAxesOffsets;
  withArrow?: boolean;
  arrowPosition?: ArrowPosition;
}

export function MenuWrapper({
  menuItemTabIndex = 0,
  position = 'bottom-start',
  offset = 8,
  withArrow = true,
  arrowPosition = 'side',
  children,
  ...props
}: Props) {
  return (
    <Menu
      position={position}
      menuItemTabIndex={menuItemTabIndex}
      offset={offset}
      withArrow={withArrow}
      arrowPosition={arrowPosition}
      {...props}
    >
      {children}
    </Menu>
  );
}
