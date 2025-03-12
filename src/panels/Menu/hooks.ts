import { useCallback, useEffect } from 'react';

import { useGetBoolPropertyValue } from '@/api/hooks';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setEnabledMenuItem, setVisibleMenuItem } from '@/redux/local/localSlice';

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
      dispatch(setEnabledMenuItem({ id: id, enabled: value }));
      dispatch(setVisibleMenuItem({ id: id, visible: value }));
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
    dispatch(setVisibleMenuItem({ id, visible: value }));
  }

  return { menuItems, filteredMenuItems, setMenuItemVisible };
}
