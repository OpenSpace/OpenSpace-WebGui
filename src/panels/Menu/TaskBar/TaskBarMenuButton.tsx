import { Button, ButtonProps } from '@mantine/core';

import { IconSize } from '@/types/enums';
import { MenuItem } from '@/windowmanagement/data/MenuItems';
import { useWindowLayoutProvider } from '@/windowmanagement/WindowLayout/hooks';

interface Props extends ButtonProps {
  item: MenuItem;
}

export function TaskBarMenuButton({ item, ...props }: Props) {
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
  } else {
    return (
      <Button
        key={item.componentID}
        p={'sm'}
        onClick={() => handleClick(item)}
        size={'xl'}
        variant={'menubar'}
        aria-label={item.title}
        {...props}
      >
        {item.renderIcon ? item.renderIcon(IconSize.lg) : item.title}
      </Button>
    );
  }
}
