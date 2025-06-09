import { PropsWithChildren } from 'react';
import { Menu } from '@mantine/core';

interface Props extends PropsWithChildren {
  /**
   * If true, limit the height of the dropdown to the window height minus an optional
   * offset
   */
  shouldLimitHeight?: boolean;
  /**
   * An optional offset from the full window height, in pixels
   */
  heightLimitOffset?: number;
  /**
   * Set to true if this is a sub-menu
   */
  isSubMenu?: boolean;
}

export function MenuDrowdownWrapper({
  shouldLimitHeight = false,
  heightLimitOffset = 0,
  isSubMenu = false,
  children
}: Props) {
  // Don't use quite the full height of the window, but leave some margin to prevent
  // unwanted overflow
  const limitHeight = shouldLimitHeight
    ? `calc(98vh - ${heightLimitOffset}px)`
    : undefined;

  return isSubMenu ? (
    <Menu.Sub.Dropdown
      mah={limitHeight}
      style={shouldLimitHeight ? { overflowY: 'auto' } : undefined}
    >
      {children}
    </Menu.Sub.Dropdown>
  ) : (
    <Menu.Dropdown
      mah={limitHeight}
      style={shouldLimitHeight ? { overflowY: 'auto' } : undefined}
    >
      {children}
    </Menu.Dropdown>
  );
}
