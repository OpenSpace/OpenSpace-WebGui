import { Dispatch, SetStateAction } from 'react';
import { Checkbox, Group, Menu, Stack } from '@mantine/core';

import { ChevronRightIcon, TaskBarIcon } from '@/icons/icons';
import { IconSize } from '@/types/enums';
import { menuItemsData } from '@/windowmanagement/data/MenuItems';

import './TaskBarMenuChoices.css';
import { TopMenu } from './TopMenu';

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
    <TopMenu position={'right-start'} withinPortal={false} closeOnItemClick={false}>
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
        <Stack gap={0}>
          {menuItemsData.map((item) => {
            return (
              <Group className={'ToggleTaskBarItemParent'} key={item.componentID}>
                {item.renderIcon?.(IconSize.xs)}
                <Checkbox
                  className={'ToggleTaskBarItem'}
                  label={item.title}
                  labelPosition={'left'}
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
                        const index = prevstate.findIndex(
                          (id) => id === item.componentID
                        );
                        if (index >= 0) {
                          prevstate.splice(index, 1);
                        }
                      }
                      return [...prevstate];
                    });
                  }}
                />
              </Group>
            );
          })}
        </Stack>
      </Menu.Dropdown>
    </TopMenu>
  );
}
