import { CheckboxIndicator, Group, Menu, Radio, Stack } from '@mantine/core';

import { DragReorderList } from '@/components/DragReorderList/DragReorderList';
import { AdditionalDataOptions } from '@/components/Property/types';
import { useOptionProperty, usePropertyDescription } from '@/hooks/properties';
import { ChevronRightIcon, SaveIcon, TaskBarIcon, VisibilityIcon } from '@/icons/icons';
import { useAppDispatch } from '@/redux/hooks';
import { setMenuItemsOrder } from '@/redux/local/localSlice';
import { IconSize } from '@/types/enums';
import { menuItemsData } from '@/windowmanagement/data/MenuItems';

import { useMenuItems } from '../../hooks';
import { TopBarMenuWrapper } from '../TopBarMenuWrapper';

export function ViewMenu() {
  const { menuItems, setMenuItemVisible } = useMenuItems();
  const [propertyVisibility, setPropertyVisibility] = useOptionProperty(
    'OpenSpaceEngine.PropertyVisibility'
  );
  const description = usePropertyDescription('OpenSpaceEngine.PropertyVisibility');
  const dispatch = useAppDispatch();

  if (!description) {
    return <></>;
  }
  const { Options: data } = description.additionalData as AdditionalDataOptions;

  return (
    <TopBarMenuWrapper targetTitle={'View'} withinPortal={false}>
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
      <TopBarMenuWrapper
        targetTitle={
          <Menu.Item
            leftSection={<VisibilityIcon />}
            rightSection={<ChevronRightIcon size={IconSize.sm} />}
          >
            User Visibility
          </Menu.Item>
        }
        position={'right-start'}
        withinPortal={false}
        closeOnItemClick={false}
      >
        <Menu.Label>Set visibility level for user</Menu.Label>
        <Radio.Group
          value={propertyVisibility?.toString()}
          onChange={(newValue) => setPropertyVisibility(parseInt(newValue))}
        >
          <Stack gap={'xs'} m={'xs'}>
            {Object.entries(data).map(([key, option]) => (
              <Radio key={key} aria-label={option} label={option} value={key} />
            ))}
          </Stack>
        </Radio.Group>
      </TopBarMenuWrapper>
    </TopBarMenuWrapper>
  );
}
