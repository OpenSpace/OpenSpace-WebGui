import { useEffect, useState } from 'react';

import { useOpenSpaceApi } from '@/api/hooks';

export function useShowGUI() {
  const luaApi = useOpenSpaceApi();
  // We dont want to show the dashboards if they were disabled from the start
  const [toggleDashboards, setToggleDashboards] = useState(true);

  // Skipping useProperty('BoolProperty') here since we don't want to subscribe to the changes
  useEffect(() => {
    luaApi
      ?.propertyValue('Dashboard.IsEnabled')
      .then((value) => setToggleDashboards(value as boolean));
  }, [luaApi]);

  async function showGUI(value: boolean) {
    luaApi?.setPropertyValueSingle('Modules.CefWebGui.Visible', value);

    if (toggleDashboards) {
      luaApi?.setPropertyValueSingle('Dashboard.IsEnabled', value);
    }
  }

  return showGUI;
}
