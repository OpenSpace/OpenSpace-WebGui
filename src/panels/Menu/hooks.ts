import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setMenuItemsOrder, setMenuItemVisible } from '@/redux/local/localSlice';
import { handleNotificationLogging } from '@/redux/logging/loggingMiddleware';
import { LogLevel } from '@/types/enums';
import { useSaveLoadJsonFiles } from '@/util/fileIOhooks';
import { MenuItem, menuItemsData } from '@/windowmanagement/data/MenuItems';
import { useWindowLayoutProvider } from '@/windowmanagement/WindowLayout/hooks';

import { TaskbarItemConfig } from './types';

export function useMenuItems() {
  const menuItems = useAppSelector((state) => state.local.taskbarItems);

  const filteredMenuItems = menuItems.filter((item) => item.visible);

  return { menuItems, filteredMenuItems };
}

function useShowWindowOnStart(shouldShow: boolean, menuItem: MenuItem) {
  const { addWindow } = useWindowLayoutProvider();

  const dispatch = useAppDispatch();

  useEffect(() => {
    // Show the menu button in the taskbar
    dispatch(setMenuItemVisible({ id: menuItem.componentID, visible: shouldShow }));
    if (shouldShow) {
      // Open the window if it is visible
      addWindow(menuItem.content, {
        id: menuItem.componentID,
        title: menuItem.title,
        position: menuItem.preferredPosition
      });
    }
  }, [addWindow, dispatch, shouldShow, menuItem]);
}

export function useStoredLayout() {
  const menuItems = useAppSelector((state) => state.local.taskbarItems);
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

  const { t } = useTranslation('menu', { keyPrefix: 'error-load-taskbar-layout' });
  const dispatch = useAppDispatch();

  function handlePickedFile(content: JSON) {
    if (!content || Object.keys(content).length === 0) {
      dispatch(
        handleNotificationLogging(t('title'), t('messages.empty-file'), LogLevel.Error)
      );
      return;
    }
    const newLayout = Object.values(content) as TaskbarItemConfig[];
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
    // We have to ensure that all ids are valid before we can set
    // the new layout
    const isValid = newLayout.every((newItem) =>
      menuItems.find((existingItem) => existingItem.id === newItem.id)
    );
    if (!isValid) {
      dispatch(
        handleNotificationLogging(t('title'), t('messages.inavlid-ids'), LogLevel.Error)
      );
      return;
    }
    // If it is valid we set the new layout
    dispatch(setMenuItemsOrder(newLayout));
  }

  async function saveLayout() {
    // Our lua function can't read the object if it is an array so
    // we need to convert it to an object
    const object = menuItems.reduce<Record<string, TaskbarItemConfig>>(
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
