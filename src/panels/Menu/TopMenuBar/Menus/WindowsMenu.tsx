import { Menu } from '@mantine/core';

import { IconSize } from '@/types/enums';
import { menuItemsData } from '@/windowmanagement/data/MenuItems';
import { useWindowLayoutProvider } from '@/windowmanagement/WindowLayout/hooks';

import { TopBarMenuWrapper } from '../TopBarMenuWrapper';

export function WindowsMenu() {
  const { addWindow } = useWindowLayoutProvider();

  return (
    <TopBarMenuWrapper closeOnItemClick={false} targetTitle={'Windows'}>
      <Menu.Label>Add New Window</Menu.Label>
      {Object.values(menuItemsData).map((item) => (
        <Menu.Item
          key={item.componentID}
          leftSection={item.renderIcon?.(IconSize.xs)}
          onClick={() => {
            addWindow(item.content, {
              title: item.title,
              position: item.preferredPosition,
              id: item.componentID,
              floatPosition: item.floatPosition
            });
          }}
        >
          {item.title}
        </Menu.Item>
      ))}
    </TopBarMenuWrapper>
  );
}
