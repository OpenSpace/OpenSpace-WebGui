import { useCallback, useEffect } from 'react';

import { useBoolProperty } from '@/hooks/properties';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  setMenuItemEnabled,
  setMenuItemVisible as setMenuItemVisibleRedux
} from '@/redux/local/localSlice';

export function useMenuItems() {
  const menuItems = useAppSelector((state) => state.local.taskbarItems);
  const hasMission = useAppSelector((state) => state.missions.isInitialized);
  const [isExoplanetsEnabled] = useBoolProperty('Modules.Exoplanets.Enabled');
  const [isSkyBrowserEnabled] = useBoolProperty('Modules.SkyBrowser.Enabled');

  const filteredMenuItems = menuItems.filter((item) => item.visible);

  const dispatch = useAppDispatch();

  // The setVisibleMenuItems dispatch in these useEffects are there to make sure we have
  // the correct visible state if a module or mission is not loaded on startup. The side
  // effect is also that when enabling/disabling a module during runtime, the menu item is
  // automatically shown or hidden in the taskbar.
  // @TODO: (anden88 2025-03-10): Investigate if SkyBrowser & Exoplanets still need the
  // enabled property
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

  return { menuItems, filteredMenuItems };
}
