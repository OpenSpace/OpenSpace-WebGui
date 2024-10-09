import { Dispatch, SetStateAction } from 'react';
import { Checkbox, Menu } from '@mantine/core';

import { menuItemsDB } from '@/util/MenuItems';

interface TaskBarChoicesProps {
  visibleMenuItems: string[];
  setVisibleMenuItems: Dispatch<SetStateAction<string[]>>;
}

export function TaskBarMenuChoices({
  visibleMenuItems,
  setVisibleMenuItems
}: TaskBarChoicesProps) {
  // Mapping menu item ids to boolean flag to determine their checked status
  const checkedMenuItems: { [key: string]: boolean } = {};
  visibleMenuItems.forEach((menuItemID) => {
    checkedMenuItems[menuItemID] = true;
  });

  return (
    <Menu position="right-start" withinPortal={false} closeOnItemClick={false}>
      <Menu.Target>
        <Menu.Item>Task Bar</Menu.Item>
      </Menu.Target>
      <Menu.Dropdown>
        {menuItemsDB.map((item) => (
          <Checkbox
            key={item.componentID}
            label={item.title}
            defaultChecked={checkedMenuItems[item.componentID]}
            onChange={(event) => {
              const { checked } = event.currentTarget;
              setVisibleMenuItems((prevstate) => {
                if (checked) {
                  // This check is necessary because the callback is sometimes called
                  // twice, meaning we would otherwise add the item multiple times
                  if (prevstate.includes(item.componentID)) {
                    return prevstate;
                  }
                  prevstate.push(item.componentID);
                } else {
                  const index = prevstate.findIndex((id) => id === item.componentID);
                  if (index >= 0) {
                    prevstate.splice(index, 1);
                  }
                }
                return [...prevstate];
              });
            }}
          />
        ))}
      </Menu.Dropdown>
    </Menu>
  );
}
