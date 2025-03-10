import { CheckboxIndicator, Container, Group, Menu } from '@mantine/core';

import { DragReorderList } from '@/components/DragReorderList/DragReorderList';
import { Property } from '@/components/Property/Property';
import { ChevronRightIcon, SaveIcon, TaskBarIcon, VisibilityIcon } from '@/icons/icons';
import { useAppDispatch } from '@/redux/hooks';
import { updateMenuItemsOrder } from '@/redux/local/localSlice';
import { IconSize } from '@/types/enums';
import { menuItemsData } from '@/windowmanagement/data/MenuItems';

import { useMenuItems } from '../../hooks';
import { TaskbarItemConfig } from '../../types';
import { TopBarMenuWrapper } from '../TopBarMenuWrapper';

export function ViewMenu() {
  const { menuItems, setMenuItemVisible } = useMenuItems();

  const dispatch = useAppDispatch();

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
        <DragReorderList<TaskbarItemConfig>
          onDragEnd={({ updatedData }) => {
            dispatch(updateMenuItemsOrder(updatedData));
          }}
          data={menuItems}
          id={'viewMenu'}
          renderFunc={(itemConfig) => {
            const item = menuItemsData[itemConfig.id];
            return (
              <Menu.Item
                key={item.componentID}
                leftSection={item.renderIcon?.(IconSize.xs)}
                rightSection={<CheckboxIndicator checked={itemConfig.visible} />}
                onClick={() => setMenuItemVisible(itemConfig.id, !itemConfig.visible)}
              >
                {item.title}
              </Menu.Item>
            );
          }}
          keyFunc={(item) => item.id}
          gap={0}
        />
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
