import { Menu } from '@mantine/core';

import { IconSize } from '@/types/enums';
import { menuItemsData } from '@/windowmanagement/data/MenuItems';
import { useWindowLayoutProvider } from '@/windowmanagement/WindowLayout/hooks';

export function NewWindowMenu() {
  const { addWindow } = useWindowLayoutProvider();

  return (
    <>
      <Menu.Label>Add New Window</Menu.Label>
      {menuItemsData.map((item) => (
        <Menu.Item
          key={item.componentID}
          leftSection={item.renderIcon?.(IconSize.xs)}
          onClick={() => {
            addWindow(item.content, {
              title: item.title,
              position: item.preferredPosition,
              id: item.componentID
            });
          }}
        >
          {item.title}
        </Menu.Item>
      ))}
    </>
  );
}
