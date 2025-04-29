import { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setMenuItemsOrder, setMenuItemVisible } from '@/redux/local/localSlice';
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
    if (!hasMission) {
      return;
    }
    // Show the missions button in the taskbar if a mission is loaded
    dispatch(
      setMenuItemVisible({ id: menuItemsData.mission.componentID, visible: true })
    );
    // Open the missions window if a mission is loaded
    addWindow(menuItemsData.mission.content, {
      id: menuItemsData.mission.componentID,
      title: menuItemsData.mission.title,
      position: menuItemsData.mission.preferredPosition
    });
  }, [hasMission]);

  function handlePickedFile(content: JSON) {
    if (!content || Object.keys(content).length === 0) {
      console.error('File is empty');
      return;
    }
    const newLayout = Object.values(content) as TaskbarItemConfig[];
    if (newLayout.length !== menuItems.length) {
      console.error('Invalid layout file. Length does not match');
      return;
    }
    // We have to ensure that all ids are valid before we can set
    // the new layout
    const isValid = newLayout.every((newItem) =>
      menuItems.find((existingItem) => existingItem.id === newItem.id)
    );
    if (!isValid) {
      console.error("Invalid layout file. All id's must match");
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
