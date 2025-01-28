import { useEffect } from 'react';
import { Button, Container, Divider, Text, Title } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { useAppSelector } from '@/redux/hooks';
import { useWindowLayoutProvider } from '@/windowmanagement/WindowLayout/hooks';

import { ImageListWrapper } from './ImageList/ImageListWrapper';
import { BrowserTabs } from './Tabs/BrowserTabs';
import { WorldWideTelescope } from './WorldWideTelescope/WorldWideTelescope';
import { useGetSkyBrowserData } from './hooks';
import { WwtProvider } from './WorldWideTelescope/WwtProvider/WwtProvider';

export function SkyBrowserPanel() {
  const luaApi = useOpenSpaceApi();
  const { addWindow } = useWindowLayoutProvider();
  const isInitialized = useAppSelector((state) => state.skybrowser.isInitialized);
  const cameraInSolarSystem = useAppSelector(
    (state) => state.skybrowser.cameraInSolarSystem
  );
  const noOfBrowsers = useAppSelector(
    (state) => Object.keys(state.skybrowser.browsers).length
  );
  useGetSkyBrowserData();

  useEffect(() => {
    if (noOfBrowsers > 0) {
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
  }, [addWindow, noOfBrowsers]);

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
      <BrowserTabs />
    </Container>
  );
}
