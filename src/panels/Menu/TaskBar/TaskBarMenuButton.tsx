import { Button, ButtonProps } from '@mantine/core';

import { MenuItemEventHandlers } from '@/types/types';

interface Props extends MenuItemEventHandlers, ButtonProps {
  isOpen: boolean;
}

export function TaskBarMenuButton({
  onClick,
  onRightClick,
  isOpen,
  children,
  ...props
}: Props) {
  return (
    <Button
      px={'sm'}
      onClick={onClick}
      onContextMenu={onRightClick}
      size={'xl'}
      variant={'menubar'}
      {...props}
      style={{
        borderBottom: isOpen ? '4px solid var(--mantine-primary-color-filled)' : '',
        borderRadius: 0
      }}
    >
      {children}
    </Button>
  );
}
