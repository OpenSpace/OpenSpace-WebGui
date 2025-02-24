import { Dispatch, SetStateAction } from 'react';
import { CheckboxIndicator, Container, Group, Menu } from '@mantine/core';

import { Property } from '@/components/Property/Property';
import { ChevronRightIcon, SaveIcon, TaskBarIcon, VisibilityIcon } from '@/icons/icons';
import { IconSize } from '@/types/enums';
import { menuItemsData } from '@/windowmanagement/data/MenuItems';

import { TopBarMenuWrapper } from '../TopBarMenuWrapper';

interface Props {
  visibleMenuItems: string[];
  setVisibleMenuItems: Dispatch<SetStateAction<string[]>>;
}

export function ViewMenu({ visibleMenuItems, setVisibleMenuItems }: Props) {
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
    <TopBarMenuWrapper targetTitle={'View'}>
      <TopBarMenuWrapper
        targetTitle={
          <Menu.Item
            leftSection={<TaskBarIcon />}
            rightSection={<ChevronRightIcon size={IconSize.sm} />}
          >
            Task Bar
          </Menu.Item>
        }
        position={'right-start'}
        withinPortal={false}
        closeOnItemClick={false}
      >
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
      </TopBarMenuWrapper>

      <Menu.Item leftSection={<SaveIcon />}>Load/Save Layout</Menu.Item>
      <Menu.Divider />
      <Menu.Label>
        <Group>
          <VisibilityIcon /> User Visibility
        </Group>
      </Menu.Label>
      <Container>
        <Property uri={'OpenSpaceEngine.PropertyVisibility'} />
      </Container>
    </TopBarMenuWrapper>
  );
}
