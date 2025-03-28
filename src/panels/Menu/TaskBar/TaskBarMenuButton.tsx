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

  if (id === '') {
    // This is a special case used to show the buttons in the getting started guide.
    // These buttons should not be clickable
    return (
      <Button px={'sm'} size={'lg'} {...props} style={{ pointerEvents: 'none' }}>
        {children}
      </Button>
    );
  }

  const item = menuItemsData[id];

  if (!item) {
    throw new Error(`No menu item found for id: ${id}`);
  }

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
      aria-label={item?.title}
      style={{
        borderBottom: itemConfig?.isOpen ? 'var(--openspace-border-active)' : '',
        borderRadius: 0
      }}
      {...props}
    >
      {children}
    </Button>
  );
}
