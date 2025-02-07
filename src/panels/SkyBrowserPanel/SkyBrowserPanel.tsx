import { useCallback, useEffect } from 'react';
import { Button, Center, Container, Image, ScrollArea, Stack, Text } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { useAppSelector } from '@/redux/hooks';
import { useWindowLayoutProvider } from '@/windowmanagement/WindowLayout/hooks';

import { ImageListWrapper } from './ImageList/ImageListWrapper';
import { BrowserTabs } from './Tabs/BrowserTabs';
import { WorldWideTelescopeView } from './WorldWideTelescope/WorldWideTelescopeView';
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
        <WorldWideTelescopeView />
      </WwtProvider>,
      {
        id: 'WorldWideTelescope',
        title: 'World Wide Telescope'
      }
    );
  }, [addWindow]);

  // Call this function first render to open the wwt window
  useEffect(() => {
    if (noOfBrowsers > 0) {
      openWorldWideTelescope();
    }
  }, [openWorldWideTelescope, noOfBrowsers]);

  if (!isInitialized || !luaApi) {
    return <Text>...Loading...</Text>;
  }
  if (isInitialized && noOfBrowsers === 0) {
    return (
      <Stack h={'100%'} w={'100%'} align="center" p={'lg'}>
        <Button onClick={() => luaApi.skybrowser.createTargetBrowserPair()} my={'lg'}>
          Add browser
        </Button>
        <Text ta={'center'} c="dimmed" mt={'lg'}>
          Powered by AAS WorldWide Telescope
        </Text>
        <Image src={'wwt.png'} mah={100} maw={100} mb={'lg'} />
      </Stack>
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
