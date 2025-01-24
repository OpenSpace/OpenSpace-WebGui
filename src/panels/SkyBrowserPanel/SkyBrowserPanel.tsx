import { useEffect } from 'react';
import { Button, Container, Divider, Text, Title } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { useAppSelector } from '@/redux/hooks';
import { useWindowLayoutProvider } from '@/windowmanagement/WindowLayout/hooks';

import { ImageListWrapper } from './ImageList/ImageListWrapper';
import { BrowserTabs } from './Tabs/BrowserTabs';
import { WorldWideTelescope } from './WorldWideTelescope/WorldWideTelescope';
import { useGetSkyBrowserData } from './hooks';

export function SkyBrowserPanel() {
  const luaApi = useOpenSpaceApi();
  const { addWindow } = useWindowLayoutProvider();
  const isInitialized = useAppSelector((state) => state.skybrowser.isInitialized);
  const cameraInSolarSystem = useAppSelector(
    (state) => state.skybrowser.cameraInSolarSystem
  );
  const browsers = useAppSelector((state) => state.skybrowser.browsers);
  useGetSkyBrowserData();

  useEffect(
    () =>
      addWindow(<WorldWideTelescope />, {
        id: 'WorldWideTelescope',
        title: 'World Wide Telescope'
      }),
    [addWindow]
  );

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
