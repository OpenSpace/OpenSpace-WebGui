import { useCallback, useEffect, useLayoutEffect } from 'react';

import { useGetBoolPropertyValue, useOpenSpaceApi } from '@/api/hooks';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  setMenuItemEnabled,
  setMenuItemVisible as setMenuItemVisibleRedux
} from '@/redux/local/localSlice';
import { loadFileFromPicker, saveFileFromPicker } from '@/util/fileIO';

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

  const luaApi = useOpenSpaceApi();
  const dispatch = useAppDispatch();

  const setNewLayout = useCallback(
    (newLayout: TaskbarItemConfig[]) => {
      for (const item of newLayout) {
        dispatch(setMenuItemVisibleRedux({ id: item.id, visible: item.visible }));
      }
    },
    [dispatch]
  );

  // Before first render, get the settings we have for the taskbar items.
  useLayoutEffect(() => {
    async function getSavedFile() {
      /* eslint-disable no-template-curly-in-string */
      const layoutPath = await luaApi?.absPath('${USER_UI_TASKBAR}');
      if (!layoutPath) {
        return;
      }
      const fileExists = await luaApi?.fileExists(layoutPath);
      if (!fileExists) {
        return;
      }
      const result = await luaApi?.loadJson(layoutPath);
      if (result) {
        setNewLayout(Object.values(result) as TaskbarItemConfig[]);
      }
    }
    if (luaApi) {
      getSavedFile();
    }
  }, [luaApi, dispatch, setNewLayout]);

  async function loadLayout() {
    const contents = await loadFileFromPicker();
    try {
      const parsedFile = Object.values(JSON.parse(contents)) as TaskbarItemConfig[];
      setNewLayout(parsedFile);
    } catch (e) {
      // TODO: do we want to throw here?
      console.error('Error parsing file', e);
    }
  }

  async function saveLayout() {
    // Our lua function can't read the object if it is an array so
    // we need to convert it to an object
    const object = menuItems.reduce<Record<string, TaskbarItemConfig>>(
      (acc, item, index) => {
        acc[index.toString()] = item;
        return acc;
      },
      {}
    );
    saveFileFromPicker(JSON.stringify(object));
  }

  return { saveLayout, loadLayout };
}
