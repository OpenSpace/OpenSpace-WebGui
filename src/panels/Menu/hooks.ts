import { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setMenuItemsOrder, setMenuItemVisible } from '@/redux/local/localSlice';
import { handleNotificationLogging } from '@/redux/logging/loggingMiddleware';
import { LogLevel } from '@/types/enums';
import { useSaveLoadJsonFiles } from '@/util/fileIOhooks';
import { menuItemsData } from '@/windowmanagement/data/MenuItems';
import { useWindowLayoutProvider } from '@/windowmanagement/WindowLayout/hooks';

import { TaskbarItemConfig } from './types';

export function useMenuItems() {
  const menuItems = useAppSelector((state) => state.local.taskbarItems);

  const filteredMenuItems = menuItems.filter((item) => item.visible);

  return { menuItems, filteredMenuItems };
}

export function useStoredLayout() {
  const menuItems = useAppSelector((state) => state.local.taskbarItems);
  const hasMission = useAppSelector((state) => state.missions.isInitialized);
  const { addWindow } = useWindowLayoutProvider();

  const { openSaveFileDialog, openLoadFileDialog } =
    useSaveLoadJsonFiles(handlePickedFile);

  const dispatch = useAppDispatch();

  // Special handling of when a mission file is loaded
  useEffect(() => {
    // Show the missions button in the taskbar if a mission is loaded
    dispatch(
      setMenuItemVisible({ id: menuItemsData.mission.componentID, visible: hasMission })
    );
    if (hasMission) {
      // Open the missions window if a mission is loaded
      addWindow(menuItemsData.mission.content, {
        id: menuItemsData.mission.componentID,
        title: menuItemsData.mission.title,
        position: menuItemsData.mission.preferredPosition
      });
    }
  }, [addWindow, dispatch, hasMission]);

  function handlePickedFile(content: JSON) {
    if (!content || Object.keys(content).length === 0) {
      dispatch(
        handleNotificationLogging(
          'Error loading JSON file',
          'File is empty',
          LogLevel.Error
        )
      );
      return;
    }
    const newLayout = Object.values(content) as TaskbarItemConfig[];
    if (newLayout.length !== menuItems.length) {
      dispatch(
        handleNotificationLogging(
          'Error loadding JSON file',
          'Invalid layoutfile, length does not match',
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
        handleNotificationLogging(
          'Error loading JSON file',
          'Invalid layout file, all IDs must match panel IDs',
          LogLevel.Error
        )
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
