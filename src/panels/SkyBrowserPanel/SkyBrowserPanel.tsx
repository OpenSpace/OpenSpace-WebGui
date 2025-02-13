import { useCallback, useEffect, useState } from 'react';
import { Button, Image, Loader, ScrollArea, Stack, Text } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { PlusIcon } from '@/icons/icons';
import { useAppSelector } from '@/redux/hooks';
import { useWindowLayoutProvider } from '@/windowmanagement/WindowLayout/hooks';

import { ImageListWrapper } from './ImageList/ImageListWrapper';
import { BrowserTabs } from './Tabs/BrowserTabs';
import { WorldWideTelescopeView } from './WorldWideTelescope/WorldWideTelescopeView';
import { WwtProvider } from './WorldWideTelescope/WwtProvider/WwtProvider';
import { useGetSkyBrowserData } from './hooks';

export function SkyBrowserPanel() {
  const [waitingForData, setWaitingForData] = useState(false);
  const isInitialized = useAppSelector((state) => state.skybrowser.isInitialized);
  const cameraInSolarSystem = useAppSelector(
    (state) => state.skybrowser.cameraInSolarSystem
  );
  const nBrowsers = useAppSelector((state) => state.skybrowser.browserIds.length);
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
    if (nBrowsers > 0) {
      openWorldWideTelescope();
      setWaitingForData(false);
    }
  }, [openWorldWideTelescope, nBrowsers, setWaitingForData]);

  if (!isInitialized || !luaApi || waitingForData) {
    return (
      <Stack align={'center'}>
        <Text>Loading Sky Browser...</Text>
        <Loader />
      </Stack>
    );
  }
  if (!cameraInSolarSystem) {
    return <Text m={'lg'}>Camera has to be in solar system for Sky Browser to work</Text>;
  }
  if (nBrowsers === 0) {
    return (
      <Stack h={'100%'} w={'100%'} align={'center'} p={'lg'}>
        <Button
          onClick={() => {
            luaApi.skybrowser.createTargetBrowserPair();
            setWaitingForData(true);
          }}
          my={'lg'}
          leftSection={<PlusIcon />}
          size={'lg'}
        >
          Add browser
        </Button>
        <Text ta={'center'} c={'dimmed'} mt={'lg'}>
          Powered by AAS WorldWide Telescope
        </Text>
        <Image src={'wwt.png'} mah={100} maw={100} mb={'lg'} />
      </Stack>
    );
  }

  return (
    <ScrollArea dir={'y'} h={'100%'}>
      <ImageListWrapper />
      <BrowserTabs openWorldWideTelescope={openWorldWideTelescope} />
    </ScrollArea>
  );
}
