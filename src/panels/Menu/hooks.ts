import { useEffect } from 'react';

import { useGetBoolPropertyValue } from '@/api/hooks';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setEnabledMenuItems, setVisibleMenuItems } from '@/redux/local/localSlice';

export function useMenuItems() {
  const menuItems = useAppSelector((state) => state.local.menu.items);
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
  useEffect(() => {
    dispatch(setEnabledMenuItems({ id: 'mission', enabled: hasMission }));
    dispatch(setVisibleMenuItems({ id: 'mission', visible: hasMission }));
  }, [hasMission]);

  useEffect(() => {
    dispatch(
      setEnabledMenuItems({ id: 'exoplanets', enabled: isExoplanetsEnabled ?? false })
    );
    dispatch(
      setVisibleMenuItems({ id: 'exoplanets', visible: isExoplanetsEnabled ?? false })
    );
  }, [isExoplanetsEnabled]);

  useEffect(() => {
    dispatch(
      setEnabledMenuItems({ id: 'skyBrowser', enabled: isSkyBrowserEnabled ?? false })
    );
    dispatch(
      setVisibleMenuItems({ id: 'skyBrowser', visible: isSkyBrowserEnabled ?? false })
    );
  }, [isSkyBrowserEnabled]);

  function setMenuItemVisible(id: string, value: boolean) {
    dispatch(setVisibleMenuItems({ id, visible: value }));
  }

  return { menuItems, filteredMenuItems, setMenuItemVisible };
}
