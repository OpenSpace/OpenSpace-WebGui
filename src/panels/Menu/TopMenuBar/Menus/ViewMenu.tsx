import { CheckboxIndicator, Group, Menu, Radio, Stack } from '@mantine/core';

import { DragReorderList } from '@/components/DragReorderList/DragReorderList';
import { InfoBox } from '@/components/InfoBox/InfoBox';
import { AdditionalDataOptions } from '@/components/Property/types';
import { useOptionProperty, usePropertyDescription } from '@/hooks/properties';
import {
  ChevronRightIcon,
  SaveIcon,
  TaskBarIcon,
  UpArrowIcon,
  VisibilityIcon
} from '@/icons/icons';
import { useAppDispatch } from '@/redux/hooks';
import { setMenuItemsOrder, setMenuItemVisible } from '@/redux/local/localSlice';
import { IconSize } from '@/types/enums';
import { menuItemsData } from '@/windowmanagement/data/MenuItems';

import { useMenuItems, useStoredLayout } from '../../hooks';
import { TopBarMenuWrapper } from '../TopBarMenuWrapper';

export function ViewMenu() {
  const { menuItems } = useMenuItems();
  const [propertyVisibility, setPropertyVisibility] = useOptionProperty(
    'OpenSpaceEngine.PropertyVisibility'
  );

  const { loadLayout, saveLayout } = useStoredLayout();
  const description = usePropertyDescription('OpenSpaceEngine.PropertyVisibility');
  const dispatch = useAppDispatch();

  if (!description) {
    return <></>;
  }
  const { Options: userLevelOptions } =
    description.additionalData as AdditionalDataOptions;

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
                onClick={() =>
                  dispatch(
                    setMenuItemVisible({
                      id: itemConfig.id,
                      visible: !itemConfig.visible
                    })
                  )
                }
              >
                {item.title}
              </Menu.Item>
            );
          }}
          gap={0}
        />
      </TopBarMenuWrapper>

      <Menu.Item leftSection={<UpArrowIcon />} onClick={loadLayout}>
        Load Task Bar Settings
      </Menu.Item>
      <Menu.Item leftSection={<SaveIcon />} onClick={saveLayout}>
        Save Task Bar Settings
      </Menu.Item>
      <Menu.Divider />
      <Menu.Label>
        <Group>
          <VisibilityIcon /> User Visibility
        </Group>
      </Menu.Label>

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
        <Menu.Label>
          <Group justify={'space-between'}>
            Set visibility level
            <InfoBox>
              {`Controls what settings will be exposed in the interface. Increase the
                level to reveal more advanced settings.`}
            </InfoBox>
          </Group>
        </Menu.Label>
        <Radio.Group
          value={propertyVisibility?.toString()}
          onChange={(newValue) => setPropertyVisibility(parseInt(newValue))}
          onKeyDown={(event) => event.stopPropagation()}
        >
          <Stack gap={'xs'} m={'xs'}>
            {Object.entries(userLevelOptions).map(([key, option]) => (
              <Radio key={key} aria-label={option} label={option} value={key} />
            ))}
          </Stack>
        </Radio.Group>
      </TopBarMenuWrapper>
    </TopBarMenuWrapper>
  );
}
