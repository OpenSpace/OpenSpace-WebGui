import { PropsWithChildren } from 'react';
import { Menubar, MenubarMenuProps } from '@mantine/core';
import { useElementSize } from '@mantine/hooks';

import { MenuDropdownWrapper } from './MenuDropdownWrapper';

interface Props extends MenubarMenuProps, PropsWithChildren {
  targetTitle: string | React.ReactNode;
}

export function TopBarMenuWrapper({
  targetTitle,
  offset = 5,
  withArrow = true,
  arrowPosition = 'center',
  children,
  ...props
}: Props) {
  const { ref, height: buttonHeight } = useElementSize();
  return (
    <Menubar.Menu
      offset={offset}
      withArrow={withArrow}
      arrowPosition={arrowPosition}
      {...props}
    >
      <Menubar.Target ref={ref}>{targetTitle}</Menubar.Target>
      <MenuDropdownWrapper
        // Add some extra space to account for menu arrow, hence the constant
        heightLimitOffset={buttonHeight * 1.2}
      >
        {children}
      </MenuDropdownWrapper>
    </Menubar.Menu>
  );
}
