import { useGetStringPropertyValue, useOpenSpaceApi } from '@/api/hooks';

import { useGetSkyBrowserData } from './hooks';
import { useAppSelector } from '@/redux/hooks';
import { Button, Container, Divider, Title, Text } from '@mantine/core';
import { ImageListWrapper } from './ImageList/ImageListWrapper';
import { BrowserTabs } from './Tabs/BrowserTabs';

export function SkyBrowserPanel() {
  const [wwtUrl] = useGetStringPropertyValue('Modules.SkyBrowser.WwtImageCollectionUrl');
  const luaApi = useOpenSpaceApi();
  const isInitialized = useAppSelector((state) => state.skybrowser.isInitialized);
  const cameraInSolarSystem = useAppSelector(
    (state) => state.skybrowser.cameraInSolarSystem
  );
  const browsers = useAppSelector((state) => state.skybrowser.browsers);
  useGetSkyBrowserData();

  if (!isInitialized || !luaApi) {
    return <Text>...Loading...</Text>;
  }
  if (!cameraInSolarSystem) {
    return <Text>Camera has to be in solar system for skybrowser to work</Text>;
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
      <ImageListWrapper />
      <Divider my={'md'} />
      <BrowserTabs />
    </Container>
  );
}
