import { useCallback, useEffect } from 'react';
import { Button, ScrollArea, Text } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { useAppSelector } from '@/redux/hooks';
import { useWindowLayoutProvider } from '@/windowmanagement/WindowLayout/hooks';

import { ImageListWrapper } from './ImageList/ImageListWrapper';
import { BrowserTabs } from './Tabs/BrowserTabs';
import { WorldWideTelescope } from './WorldWideTelescope/WorldWideTelescope';
import { WwtProvider } from './WorldWideTelescope/WwtProvider/WwtProvider';
import { useGetSkyBrowserData } from './hooks';

export function SkyBrowserPanel() {
  const isInitialized = useAppSelector((state) => state.skybrowser.isInitialized);
  const cameraInSolarSystem = useAppSelector(
    (state) => state.skybrowser.cameraInSolarSystem
  );
  const noOfBrowsers = useAppSelector((state) => state.skybrowser.browserIds.length);
  const { addWindow } = useWindowLayoutProvider();
  const luaApi = useOpenSpaceApi();

  useGetSkyBrowserData();

  // Use useCallback here so we don't trigger the effect every render
  const openWorldWideTelescope = useCallback(() => {
    addWindow(
      <WwtProvider>
        <WorldWideTelescope />
      </WwtProvider>,
      {
        id: 'WorldWideTelescope',
        title: 'World Wide Telescope'
      }
    );
  }, [addWindow]);

  // Call this function first render to open the wwt window
  useEffect(() => {
    openWorldWideTelescope();
  }, [openWorldWideTelescope]);

  if (!isInitialized || !luaApi) {
    return <Text>...Loading...</Text>;
  }
  if (isInitialized && noOfBrowsers === 0) {
    return (
      <Button onClick={() => luaApi.skybrowser.createTargetBrowserPair()}>
        Add browser
      </Button>
    );
  }
  if (!cameraInSolarSystem) {
    return <Text>Camera has to be in solar system for skybrowser to work</Text>;
  }

  return (
    <ScrollArea dir={'y'} h={'100%'}>
      <ImageListWrapper />
      <BrowserTabs openWorldWideTelescope={openWorldWideTelescope} />
    </ScrollArea>
  );
}
