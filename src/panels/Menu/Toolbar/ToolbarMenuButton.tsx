import { Button, ButtonProps } from '@mantine/core';

import { useWindowLayoutProvider } from '@/windowmanagement/WindowLayout/hooks';

import { useMenuItems } from '../hooks';

interface Props extends ButtonProps {
  id: string;
}

export function ToolbarMenuButton({ id, children, ...props }: Props) {
  const menuItems = useMenuItems();
  const { addWindow, closeWindow } = useWindowLayoutProvider();

  const item = menuItems.find((item) => item.id === id);

  if (!item) {
    throw new Error(`No menu item found for id: '${id}'`);
  }

  function onClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    if (!item) {
      return;
    }
    if (event.shiftKey) {
      closeWindow(item.componentID);
    } else {
      addWindow(item.content, {
        title: item.title,
        position: item.preferredPosition,
        id: item.componentID,
        floatPosition: item.floatPosition
      });
    }
  }

  function onRightClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    if (!item) {
      return;
    }
    event.preventDefault();
    closeWindow(item.componentID);
  }

  return (
    <Button
      px={'sm'}
      onClick={onClick}
      onContextMenu={onRightClick}
      size={'xl'}
      variant={'menubar'}
      aria-label={item.title}
      style={{
        borderBottom: item?.isOpen
          ? 'var(--openspace-border-active)'
          : 'var(--openspace-border-active-placeholder)',
        borderRadius: 0
      }}
      {...props}
    >
      {children}
    </Button>
  );
}
