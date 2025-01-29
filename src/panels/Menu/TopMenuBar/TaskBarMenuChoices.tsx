import { Dispatch, SetStateAction } from 'react';
import { CheckboxIndicator, Menu } from '@mantine/core';

import { ChevronRightIcon, TaskBarIcon } from '@/icons/icons';
import { IconSize } from '@/types/enums';
import { menuItemsData } from '@/windowmanagement/data/MenuItems';

import { MenuWrapper } from './MenuWrapper';

interface TaskBarChoicesProps {
  visibleMenuItems: string[];
  setVisibleMenuItems: Dispatch<SetStateAction<string[]>>;
}

export function TaskBarMenuChoices({
  visibleMenuItems,
  setVisibleMenuItems
}: TaskBarChoicesProps) {
  function toggleMenuItem(id: string): void {
    setVisibleMenuItems((prevstate) => {
      const index = prevstate.indexOf(id);
      const isChecked = index !== -1;

      if (isChecked) {
        prevstate.splice(index, 1);
        return [...prevstate];
      } else {
        return [...prevstate, id];
      }
    });
  }

  return (
    <MenuWrapper position={'right-start'} withinPortal={false} closeOnItemClick={false}>
      <Menu.Target>
        <Menu.Item
          leftSection={<TaskBarIcon />}
          rightSection={<ChevronRightIcon size={IconSize.sm} />}
        >
          Task Bar
        </Menu.Item>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>Toggle Task Bar Items</Menu.Label>
        {menuItemsData.map((item) => (
          <Menu.Item
            key={item.componentID}
            leftSection={item.renderIcon?.(IconSize.xs)}
            rightSection={
              <CheckboxIndicator checked={visibleMenuItems.includes(item.componentID)} />
            }
            onClick={() => toggleMenuItem(item.componentID)}
          >
            {item.title}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </MenuWrapper>
  );
}
