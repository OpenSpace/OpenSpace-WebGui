import React from 'react';
import { Menu } from '@mantine/core';

import { IconSize } from '@/types/enums';
import { menuItemsData } from '@/windowmanagement/data/MenuItems';
import { WindowLayoutOptions } from '@/windowmanagement/WindowLayout/WindowLayout';

interface NewWindowMenuProps {
  addWindow: (component: React.JSX.Element, options: WindowLayoutOptions) => void;
}
export function NewWindowMenu({ addWindow }: NewWindowMenuProps) {
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
