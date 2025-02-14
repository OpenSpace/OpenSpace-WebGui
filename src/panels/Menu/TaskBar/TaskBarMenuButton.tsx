import { ActionIcon, Button } from '@mantine/core';

import { IconSize } from '@/types/enums';
import { MenuItem } from '@/windowmanagement/data/MenuItems';
import { useWindowLayoutProvider } from '@/windowmanagement/WindowLayout/hooks';

interface Props {
  item: MenuItem;
}

export function TaskBarMenuButton({ item }: Props) {
  const { addWindow } = useWindowLayoutProvider();

  function handleClick(item: MenuItem): void {
    addWindow(item.content, {
      title: item.title,
      position: item.preferredPosition,
      id: item.componentID,
      floatPosition: item.floatPosition
    });
  }

  if (item.renderMenuButton) {
    // If there is a function for rendering a custom button, always use that
    return item.renderMenuButton(item.componentID, () => handleClick(item));
  } else if (item.renderIcon) {
    // Otherwise, use the provided icon for this menu item, if there is one
    return (
      <ActionIcon
        key={item.componentID}
        onClick={() => handleClick(item)}
        size={'input-xl'}
      >
        {item.renderIcon(IconSize.lg)}
      </ActionIcon>
    );
  } else {
    // If no icon was provided, simply use the title as the button text
    return (
      <Button key={item.componentID} onClick={() => handleClick(item)} size={'xl'}>
        {item.title}
      </Button>
    );
  }
}
