import { ActionIcon, Button } from '@mantine/core';
import { MenuItem } from './data/MenuItems';
import { WindowLayoutOptions } from './WindowLayout/WindowLayout';
import { IconSize } from '@/types/enums';

interface Props {
  addWindow: (component: React.JSX.Element, options: WindowLayoutOptions) => void;
  item: MenuItem;
}

export function TaskBarMenuButton({ addWindow, item }: Props) {
  function handleClick(item: MenuItem): void {
    addWindow(item.content, {
      title: item.title,
      position: item.preferredPosition,
      id: item.componentID
    });
  }

  if (item.renderMenuButton) {
    // If there is a function for rendering a custom button, always use that
    return item.renderMenuButton(item.componentID, () => handleClick(item));
  } else if (item.renderIcon) {
    // Otherwise, use the provided icon for this menu item, if the is one
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
