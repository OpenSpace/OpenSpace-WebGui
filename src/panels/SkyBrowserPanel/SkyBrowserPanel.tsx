import { useCallback, useEffect } from 'react';
import { Button, Stack, Text, ThemeIcon } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { PlusIcon, TelescopeIcon } from '@/icons/icons';
import { useAppSelector } from '@/redux/hooks';
import { useWindowLayoutProvider } from '@/windowmanagement/WindowLayout/hooks';

import { BrowserTabs } from './BrowserTabs/BrowserTabs';
import { ImageListWrapper } from './ImageList/ImageListWrapper';
import { WorldWideTelescopeView } from './WorldWideTelescope/WorldWideTelescopeView';
import { WwtProvider } from './WorldWideTelescope/WwtProvider/WwtProvider';
import { useSkyBrowserData } from './hooks';

export function SkyBrowserPanel() {
  const isInitialized = useAppSelector((state) => state.skybrowser.isInitialized);
  const nBrowsers = useAppSelector((state) => state.skybrowser.browserIds.length);
  const { addWindow } = useWindowLayoutProvider();
  const luaApi = useOpenSpaceApi();

  useSkyBrowserData();

  // Use useCallback here so we don't trigger the effect every render
  const openWorldWideTelescope = useCallback(() => {
    const content = (
      <WwtProvider>
        <WorldWideTelescopeView />
      </WwtProvider>
    );

    addWindow(content, {
      id: 'WorldWideTelescope',
      title: 'WorldWide Telescope'
    });
  }, [addWindow]);

  // Call this function first render to open the wwt window
  useEffect(() => {
    if (nBrowsers > 0) {
      openWorldWideTelescope();
    }
  }, [openWorldWideTelescope, nBrowsers]);

  if (nBrowsers === 0) {
    return (
      <Stack h={'100%'} w={'100%'} align={'center'} p={'lg'}>
        <Button
          onClick={() => {
            luaApi?.skybrowser.createTargetBrowserPair();
          }}
          my={'lg'}
          leftSection={<PlusIcon />}
          size={'lg'}
          loading={!luaApi || !isInitialized}
        >
          Add browser
        </Button>
        <ThemeIcon size={100} variant={'transparent'}>
          <TelescopeIcon size={'100px'} />
        </ThemeIcon>
        <Text ta={'center'} c={'dimmed'} mt={'lg'}>
          Powered by WorldWide Telescope
        </Text>
      </Stack>
    );
  }

  return (
    <>
      <ImageListWrapper />
      <BrowserTabs openWorldWideTelescope={openWorldWideTelescope} />
    </>
  );
}
