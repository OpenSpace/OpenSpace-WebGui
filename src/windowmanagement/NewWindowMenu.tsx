import React from 'react';
import { Menu } from '@mantine/core';

import { ChevronRightIcon, PanelIcon } from '@/icons/icons';
import { IconSize } from '@/types/enums';

import { menuItemsDB } from './data/MenuItems';
import { WindowLayoutOptions } from './WindowLayout/WindowLayout';

interface NewWindowMenuProps {
  addWindow: (component: React.JSX.Element, options: WindowLayoutOptions) => void;
}
export function NewWindowMenu({ addWindow }: NewWindowMenuProps) {
  return (
    <Menu
      position={'right-start'}
      withinPortal={false}
      closeOnItemClick={false}
      menuItemTabIndex={0}
      withArrow
      arrowPosition={'center'}
    >
      <Menu.Target>
        <Menu.Item
          leftSection={<PanelIcon />}
          rightSection={<ChevronRightIcon size={IconSize.sm} />}
        >
          Windows
        </Menu.Item>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>Add New Window</Menu.Label>
        {menuItemsDB.map((item) => (
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
      </Menu.Dropdown>
    </Menu>
  );
}
