import { PropsWithChildren } from 'react';
import { Button, Menu, MenuProps, Text } from '@mantine/core';
import { useElementSize } from '@mantine/hooks';

import { MenuDropdownWrapper } from './MenuDropdownWrapper';

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
  const { ref, height: buttonHeight } = useElementSize();
  return (
    <Menu
      position={position}
      menuItemTabIndex={menuItemTabIndex}
      offset={offset}
      withArrow={withArrow}
      arrowPosition={arrowPosition}
      trigger={'click-hover'}
      {...props}
    >
      <Menu.Target ref={ref}>
        {typeof targetTitle === 'string' ? (
          <Button size={'xs'} variant={'menubar'} color={'white'}>
            <Text>{targetTitle}</Text>
          </Button>
        ) : (
          targetTitle
        )}
      </Menu.Target>
      <MenuDropdownWrapper
        // Add some extra space to account for menu arrow, hence the constant
        heightLimitOffset={buttonHeight * 1.2}
      >
        {children}
      </MenuDropdownWrapper>
    </Menu>
  );
}
