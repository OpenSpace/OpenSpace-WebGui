import { PropsWithChildren } from 'react';
import {
  ArrowPosition,
  Button,
  FloatingAxesOffsets,
  FloatingPosition,
  Menu,
  MenuProps,
  Text
} from '@mantine/core';

interface Props extends MenuProps, PropsWithChildren {
  targetTitle: string | React.ReactNode;
  menuItemTabIndex?: -1 | 0;
  position?: FloatingPosition;
  offset?: number | FloatingAxesOffsets;
  withArrow?: boolean;
  arrowPosition?: ArrowPosition;
}

export function TopBarMenuWrapper({
  targetTitle,
  menuItemTabIndex = 0,
  position = 'bottom-start',
  offset = 5,
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
      withArrow={withArrow}
      arrowPosition={arrowPosition}
      {...props}
    >
      <Menu.Target>
        {typeof targetTitle === 'string' ? (
          <Button size={'xs'} variant={'menubar'} color={'white'}>
            <Text>{targetTitle}</Text>
          </Button>
        ) : (
          targetTitle
        )}
      </Menu.Target>
      <Menu.Dropdown>{children}</Menu.Dropdown>
    </Menu>
  );
}
