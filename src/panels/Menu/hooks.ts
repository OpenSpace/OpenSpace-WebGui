import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setMenuItemsConfig, setMenuItemVisible } from '@/redux/local/localSlice';
import { handleNotificationLogging } from '@/redux/logging/loggingMiddleware';
import { LogLevel } from '@/types/enums';
import { MenuItemGroup, menuItemGroups } from '@/types/types';
import { useSaveLoadJsonFiles } from '@/util/fileIOhooks';
import { MenuItem, menuItemsData } from '@/windowmanagement/data/MenuItems';
import { useWindowLayoutProvider } from '@/windowmanagement/WindowLayout/hooks';

import { MenuItemConfig, MenuItemWithConfig } from './types';

/**
 * @returns All menu items merged with their static configuration from `menuItemsData`.
 */
export function useMenuItems(): MenuItemWithConfig[] {
  const config = useAppSelector((state) => state.local.menuItems.config);

  return useMemo(
    () =>
      config.map((item) => ({
        ...item,
        ...menuItemsData[item.id]
      })),
    [config]
  );
}

/**
 * @returns All menu items in the user-defined display order.
 */
export function useMenuItemsOrdered(): MenuItemWithConfig[] {
  const menuOrder = useAppSelector((state) => state.local.menuItems.order);
  const menuItems = useMenuItems();

  return useMemo(() => {
    const itemsById = Object.fromEntries(menuItems.map((item) => [item.id, item]));
    return menuOrder
      .map((id) => {
        const item = itemsById[id];

        if (!item) {
          return null;
        }

        return item;
      })
      .filter((item) => item !== null);
  }, [menuOrder, menuItems]);
}

/**
 * Returns the available menu items grouped by their `MenuItemGroup` along with the list
 * of groups included in the result.
 *
 * If `includeGroups` is provided, only those groups are included in the result. Items
 * within each group are sorted alphabetically by title, except for `Ungrouped` which
 * preserves the order defined in the menu item configuration.
 *
 * @param includeGroups Optional list of menu groups to include in the result, defaults to
 * all groups
 * @returns An object with:
 * - `menuItemsByGroup`: the grouped menu items
 * - `groups`: the included menu groups in order
 */
export function useMenuItemsByGroup<Included extends MenuItemGroup = MenuItemGroup>(
  includeGroups?: readonly Included[]
) {
  const menuItems = useMenuItems();

  type MappedMenuItems = Record<Included, MenuItemWithConfig[]>;

  return useMemo(() => {
    // Keep only the groups that are included
    const groups = (includeGroups ?? menuItemGroups) as readonly Included[];

    // Create a record where the keys are the group and value the list of menu items
    // belonging to that group
    const menuItemsByGroup = Object.fromEntries(
      groups.map((group) => [group, [] as MenuItemWithConfig[]])
    ) as MappedMenuItems;

    for (const item of menuItems) {
      if (item.group in menuItemsByGroup) {
        menuItemsByGroup[item.group as Included].push(item);
      }
    }

    // Sort the groups in alphabetical order, the `Ungrouped`group keeps the implicit
    // order defined by the `menuItemsData`
    for (const group of groups) {
      if (group !== 'Ungrouped') {
        menuItemsByGroup[group].sort((a, b) => a.title.localeCompare(b.title));
      }
    }

    return { groups, menuItemsByGroup };
    // includeGroups is typically a static array literal at the call site, e.g.,
    // ['HelpMenu'], so spreading it into deps avoids the referential instability of
    // passing a new array each render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuItems, ...(includeGroups ?? [])]);
}

function useShowWindowOnStart(shouldShow: boolean, menuItem: MenuItem) {
  const { addWindow } = useWindowLayoutProvider();

  const dispatch = useAppDispatch();

  useEffect(() => {
    // Show the menu button in the toolbar
    dispatch(setMenuItemVisible({ id: menuItem.componentID, visible: shouldShow }));
    if (shouldShow) {
      // Open the window if it is visible
      addWindow(menuItem.content, {
        id: menuItem.componentID,
        title: menuItem.title,
        position: menuItem.preferredPosition,
        floatPosition: menuItem.floatPosition
      });
    }
  }, [addWindow, dispatch, shouldShow, menuItem]);
}

export function useStoredLayout() {
  const { t } = useTranslation('menu', { keyPrefix: 'error-load-toolbar-layout' });
  const { addWindow } = useWindowLayoutProvider();

  const menuItems = useAppSelector((state) => state.local.menuItems.config);
  const hasMission = useAppSelector((state) => state.missions.isInitialized);
  const hasStartedBefore = useAppSelector((state) => state.profile.hasStartedBefore);
  const showGettingsStartedTour =
    hasStartedBefore === undefined ? false : !hasStartedBefore;
  // Special handling to show getting started tour on startup if first time running
  useShowWindowOnStart(showGettingsStartedTour, menuItemsData.gettingStartedTour);
  // Special handling to show mission panel if the started profile includes a mission file
  useShowWindowOnStart(hasMission, menuItemsData.mission);

  const { openSaveFileDialog, openLoadFileDialog } =
    useSaveLoadJsonFiles(handlePickedFile);

  const dispatch = useAppDispatch();

  function handlePickedFile(content: JSON) {
    if (!content || Object.keys(content).length === 0) {
      dispatch(
        handleNotificationLogging(t('title'), t('messages.empty-file'), LogLevel.Error)
      );
      return;
    }
    const newLayout = Object.values(content) as MenuItemConfig[];
    if (newLayout.length !== menuItems.length) {
      dispatch(
        handleNotificationLogging(
          t('title'),
          t('messages.invalid-length'),
          LogLevel.Error
        )
      );
      return;
    }
    // We have to ensure that all ids are valid before we can set the new layout
    const isValid = newLayout.every((newItem) =>
      menuItems.find((existingItem) => existingItem.id === newItem.id)
    );
    if (!isValid) {
      dispatch(
        handleNotificationLogging(t('title'), t('messages.inavlid-ids'), LogLevel.Error)
      );
      return;
    }
    // If it is valid we set the new layout and order
    dispatch(setMenuItemsConfig(newLayout));

    // Open any new window panel from config. @TODO (anden 2026-03-09): Do we want to
    // close the panels that set `isOpen = fals`?
    newLayout
      .filter((item) => item.isOpen)
      .map((layoutItem) => {
        const item = menuItemsData[layoutItem.id];
        addWindow(item.content, {
          id: item.componentID,
          title: item.title,
          position: item.preferredPosition,
          floatPosition: item.floatPosition
        });
      });
  }

  async function saveLayout() {
    // Our lua function can't read the object if it is an array so we need to convert it
    // to an object
    const object = menuItems.reduce<Record<string, MenuItemConfig>>(
      (accumulator, item, index) => {
        accumulator[index.toString()] = item;
        return accumulator;
      },
      {}
    );
    const content = JSON.parse(JSON.stringify(object));
    openSaveFileDialog(content);
  }

  return { saveLayout, loadLayout: openLoadFileDialog };
}
