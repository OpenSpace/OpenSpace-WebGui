import React from 'react';
import { Menu } from '@mantine/core';

import { IconSize } from '@/types/enums';

import { menuItemsDB } from './data/MenuItems';
import { WindowLayoutOptions } from './WindowLayout/WindowLayout';

interface NewWindowMenuProps {
  addWindow: (component: React.JSX.Element, options: WindowLayoutOptions) => void;
}
export function NewWindowMenu({ addWindow }: NewWindowMenuProps) {
  return (
    <>
      <Menu.Label>Add New Window</Menu.Label>
      {menuItemsDB.map((item) => (
        <Menu.Item
          key={item.componentID}
          leftSection={item.icon?.(IconSize.xs)}
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
