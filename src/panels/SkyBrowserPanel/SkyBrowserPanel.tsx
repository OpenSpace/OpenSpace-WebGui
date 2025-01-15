import { useGetStringPropertyValue, useOpenSpaceApi } from '@/api/hooks';

import { useGetSkyBrowserData } from './hooks';
import { useAppSelector } from '@/redux/hooks';
import { Button, Container, Title } from '@mantine/core';
import { ImageList } from './ImageList';

export function SkyBrowserPanel() {
  const [wwtUrl] = useGetStringPropertyValue('Modules.SkyBrowser.WwtImageCollectionUrl');
  const luaApi = useOpenSpaceApi();
  const isInitialized = useAppSelector((state) => state.skybrowser.isInitialized);
  const imageListLength = useAppSelector((state) => state.skybrowser.imageList.length);
  const cameraInSolarSystem = useAppSelector(
    (state) => state.skybrowser.cameraInSolarSystem
  );
  const browsers = useAppSelector((state) => state.skybrowser.browsers);
  useGetSkyBrowserData();

  if (!isInitialized || !luaApi) {
    console.log(isInitialized, imageListLength, luaApi);
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
  return (
    <Container>
      <Title>SkyBrowser</Title>
      <ImageList></ImageList>
    </Container>
  );
}
