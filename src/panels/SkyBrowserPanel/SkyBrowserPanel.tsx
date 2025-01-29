import { Button, Container, Divider, Text, Title } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { useAppSelector } from '@/redux/hooks';

import { ImageListWrapper } from './ImageList/ImageListWrapper';
import { BrowserTabs } from './Tabs/BrowserTabs';
import { useGetSkyBrowserData } from './hooks';
import { useWindowLayoutProvider } from '@/windowmanagement/WindowLayout/hooks';
import { useEffect } from 'react';
import { WwtProvider } from './WorldWideTelescope/WwtProvider/WwtProvider';
import { WorldWideTelescope } from './WorldWideTelescope/WorldWideTelescope';

export function SkyBrowserPanel() {
  const isInitialized = useAppSelector((state) => state.skybrowser.isInitialized);
  const cameraInSolarSystem = useAppSelector(
    (state) => state.skybrowser.cameraInSolarSystem
  );
  const noOfBrowsers = useAppSelector((state) => state.skybrowser.browserIds.length);
  const { addWindow } = useWindowLayoutProvider();
  const luaApi = useOpenSpaceApi();

  useGetSkyBrowserData();

  useEffect(() => {
    openWorldWideTelescope();
  }, [addWindow]);

  function openWorldWideTelescope() {
    addWindow(
      <WwtProvider>
        <WorldWideTelescope />
      </WwtProvider>,
      {
        id: 'WorldWideTelescope',
        title: 'World Wide Telescope'
      }
    );
  }

  if (!isInitialized || !luaApi) {
    return <Text>...Loading...</Text>;
  }
  if (!cameraInSolarSystem) {
    return <Text>Camera has to be in solar system for skybrowser to work</Text>;
  }
  if (noOfBrowsers === 0) {
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
      <BrowserTabs openWorldWideTelescope={openWorldWideTelescope} />
    </Container>
  );
}
