import { useCallback, useEffect } from 'react';

import { useGetBoolPropertyValue } from '@/api/hooks';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  setMenuItemEnabled,
  setMenuItemVisible as setMenuItemVisibleRedux
} from '@/redux/local/localSlice';
import { useSaveLoadJsonFiles } from '@/util/fileIOhooks';

import { TaskbarItemConfig } from './types';

export function useMenuItems() {
  const menuItems = useAppSelector((state) => state.local.taskbarItems);
  const hasMission = useAppSelector((state) => state.missions.isInitialized);
  const [isExoplanetsEnabled] = useGetBoolPropertyValue('Modules.Exoplanets.Enabled');
  const [isSkyBrowserEnabled] = useGetBoolPropertyValue('Modules.SkyBrowser.Enabled');

  const filteredMenuItems = menuItems.filter((item) => item.visible);

  const dispatch = useAppDispatch();

  // The setVisibleMenuItems dispatch in these useEffects are there to make sure we have
  // the correct visible state if a module or mission is not loaded on startup. The side
  // effect is also that when enabling/disabling a module during runtime, the menu item is
  // automatically shown or hidden in the taskbar.
  // @TODO: (anden88 2025-03-10): Investigate if SkyBrowser & Exoplanets still need the
  //  enabled property
  const enablePanel = useCallback(
    (id: string, value: boolean) => {
      dispatch(setMenuItemEnabled({ id: id, enabled: value }));
      dispatch(setMenuItemVisibleRedux({ id: id, visible: value }));
    },
    [dispatch]
  );

  useEffect(() => {
    enablePanel('mission', hasMission);
  }, [hasMission, enablePanel]);

  useEffect(() => {
    enablePanel('exoplanets', isExoplanetsEnabled ?? false);
  }, [isExoplanetsEnabled, enablePanel]);

  useEffect(() => {
    enablePanel('skyBrowser', isSkyBrowserEnabled ?? false);
  }, [isSkyBrowserEnabled, enablePanel]);

  function setMenuItemVisible(id: string, value: boolean) {
    dispatch(setMenuItemVisibleRedux({ id, visible: value }));
  }

  return { menuItems, filteredMenuItems, setMenuItemVisible };
}

export function useStoredLayout() {
  const menuItems = useAppSelector((state) => state.local.taskbarItems);

  const { openSaveFileDialog, openLoadFileDialog } =
    useSaveLoadJsonFiles(handlePickedFile);

  const dispatch = useAppDispatch();

  function handlePickedFile(content: JSON) {
    const newLayout = Object.values(content) as TaskbarItemConfig[];
    for (const item of newLayout) {
      dispatch(setMenuItemVisibleRedux({ id: item.id, visible: item.visible }));
    }
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
