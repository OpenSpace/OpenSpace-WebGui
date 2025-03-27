import { Button, ButtonProps } from '@mantine/core';

import { useAppSelector } from '@/redux/hooks';
import { menuItemsData } from '@/windowmanagement/data/MenuItems';
import { useWindowLayoutProvider } from '@/windowmanagement/WindowLayout/hooks';

interface Props extends ButtonProps {
  id: string;
}

export function TaskBarMenuButton({ id, children, ...props }: Props) {
  const itemConfig = useAppSelector((state) =>
    state.local.taskbarItems.find((config) => config.id === id)
  );
  const { addWindow, closeWindow } = useWindowLayoutProvider();

  const item = menuItemsData[id];

  function onClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
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
        borderBottom: itemConfig?.isOpen
          ? '4px solid var(--mantine-primary-color-filled)'
          : '',
        borderRadius: 0
      }}
      {...props}
    >
      {children}
    </Button>
  );
}
