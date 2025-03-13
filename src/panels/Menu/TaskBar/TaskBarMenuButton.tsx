import { Button, ButtonProps } from '@mantine/core';

import { MenuItemEventHandlers } from '@/types/types';

interface Props extends MenuItemEventHandlers, ButtonProps {}

export function TaskBarMenuButton({ onClick, onRightClick, children, ...props }: Props) {
  return (
    <Button
      px={'sm'}
      onClick={onClick}
      onContextMenu={onRightClick}
      size={'xl'}
      variant={'menubar'}
      {...props}
    >
      {children}
    </Button>
  );
}
