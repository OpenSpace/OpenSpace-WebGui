import { CheckboxIndicator, Container, Group, Menu } from '@mantine/core';

import { DragReorderList } from '@/components/DragReorderList/DragReorderList';
import { Property } from '@/components/Property/Property';
import { ChevronRightIcon, SaveIcon, TaskBarIcon, VisibilityIcon } from '@/icons/icons';
import { useAppDispatch } from '@/redux/hooks';
import { setMenuItemsOrder } from '@/redux/local/localSlice';
import { IconSize } from '@/types/enums';
import { menuItemsData } from '@/windowmanagement/data/MenuItems';

import { useMenuItems } from '../../hooks';
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
        <DragReorderList
          id={'viewMenu'}
          data={menuItems}
          dragHandlePosition={'right'}
          keyFunc={(item) => item.id}
          onDragEnd={({ updatedData }) => {
            dispatch(setMenuItemsOrder(updatedData));
          }}
          renderFunc={(itemConfig) => {
            const item = menuItemsData[itemConfig.id];
            return (
              <Menu.Item
                key={item.componentID}
                leftSection={
                  <Group>
                    <CheckboxIndicator checked={itemConfig.visible} />
                    {item.renderIcon?.(IconSize.xs)}
                  </Group>
                }
                onClick={() => setMenuItemVisible(itemConfig.id, !itemConfig.visible)}
              >
                {item.title}
              </Menu.Item>
            );
          }}
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
