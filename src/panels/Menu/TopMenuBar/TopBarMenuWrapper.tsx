import { PropsWithChildren } from 'react';
import { Button, Menu, MenuProps, Text } from '@mantine/core';

interface Props extends MenuProps, PropsWithChildren {
  targetTitle: string | React.ReactNode;
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
