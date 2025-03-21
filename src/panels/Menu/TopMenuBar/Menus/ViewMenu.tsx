import { CheckboxIndicator, Group, Menu } from '@mantine/core';

import { useGetOptionPropertyValue, useGetPropertyDescription } from '@/api/hooks';
import { DragReorderList } from '@/components/DragReorderList/DragReorderList';
import { AdditionalDataOptions } from '@/components/Property/Types/OptionProperty';
import { ChevronRightIcon, SaveIcon, TaskBarIcon, VisibilityIcon } from '@/icons/icons';
import { useAppDispatch } from '@/redux/hooks';
import { setMenuItemsOrder } from '@/redux/local/localSlice';
import { IconSize } from '@/types/enums';
import { menuItemsData } from '@/windowmanagement/data/MenuItems';

import { useMenuItems } from '../../hooks';
import { TopBarMenuWrapper } from '../TopBarMenuWrapper';

export function ViewMenu() {
  const { menuItems, setMenuItemVisible } = useMenuItems();
  const [propertyVisibility, setPropertyVisibility] = useGetOptionPropertyValue(
    'OpenSpaceEngine.PropertyVisibility'
  );
  const description = useGetPropertyDescription('OpenSpaceEngine.PropertyVisibility');
  const dispatch = useAppDispatch();

  if (!description) {
    return <></>;
  }

  const { Options: data } = description.additionalData as AdditionalDataOptions;

  // Get the name of the option, e.g. "Option 1"
  // Flatten the array as otherwise each element is an array
  // @TODO (ylvse 2025-03-18): Change the property format
  const options = data.map((option) => Object.values(option)).flat();

  function onChange(option: string | null) {
    if (option && options.indexOf(option) !== -1) {
      // Now we need to find the number key of the option
      // which is the same as its index in the optionsStrings array
      const index = options.indexOf(option);
      setPropertyVisibility(index);
    }
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
        {options.map((option, i) => (
          <Menu.Item
            key={option}
            leftSection={
              <Group>
                <CheckboxIndicator checked={i === propertyVisibility} />
              </Group>
            }
            onClick={() => onChange(option)}
          >
            {option}
          </Menu.Item>
        ))}
      </TopBarMenuWrapper>
    </TopBarMenuWrapper>
  );
}
