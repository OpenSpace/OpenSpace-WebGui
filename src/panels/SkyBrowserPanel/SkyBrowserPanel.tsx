import { useGetStringPropertyValue, useOpenSpaceApi } from '@/api/hooks';

import { useGetSkyBrowserData } from './hooks';
import { useAppSelector } from '@/redux/hooks';
import { Button } from '@mantine/core';

export function SkyBrowserPanel() {
  const [wwtUrl] = useGetStringPropertyValue('Modules.SkyBrowser.WwtImageCollectionUrl');
  const luaApi = useOpenSpaceApi();
  const isInitialized = useAppSelector((state) => state.skybrowser.isInitialized);
  const imageList = useAppSelector((state) => state.skybrowser.imageList);
  const cameraInSolarSystem = useAppSelector(
    (state) => state.skybrowser.cameraInSolarSystem
  );
  const browsers = useAppSelector((state) => state.skybrowser.browsers);
  useGetSkyBrowserData();

  if (!isInitialized || imageList.length === 0 || !luaApi) {
    return <>...Loading...</>;
  }
  if (!cameraInSolarSystem) {
    return <>Camera has to be in solar system for skybrowser to work</>;
  }
  if (Object.keys(browsers).length === 0) {
    return (
      <Button onClick={() => luaApi.skybrowser.createTargetBrowserPair()}>
        Add browser
      </Button>
    );
  }
  return <>SkyBrowser</>;
}
