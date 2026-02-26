import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, LoadingOverlay, Stack, Text, ThemeIcon } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { useProperty } from '@/hooks/properties';
import { PlusIcon, TelescopeIcon } from '@/icons/icons';
import { useAppSelector } from '@/redux/hooks';
import { useWindowLayoutProvider } from '@/windowmanagement/WindowLayout/hooks';

import { BrowserTabs } from './BrowserTabs/BrowserTabs';
import { ImageListWrapper } from './ImageList/ImageListWrapper';
import { InfoOverlayContent } from './WorldWideTelescope/InfoOverlayContent';
import { WorldWideTelescopeView } from './WorldWideTelescope/WorldWideTelescopeView';
import { WwtProvider } from './WorldWideTelescope/WwtProvider/WwtProvider';
import { useSkyBrowserData } from './hooks';

export function SkyBrowserPanel() {
  const { t } = useTranslation('panel-skybrowser');

  const isInitialized = useAppSelector((state) => state.skybrowser.isInitialized);
  const nBrowsers = useAppSelector((state) => state.skybrowser.browserIds.length);
  const isInSolarSystem = useAppSelector((state) => state.skybrowser.cameraInSolarSystem);

  const { addWindow } = useWindowLayoutProvider();
  const luaApi = useOpenSpaceApi();

  const shouldHideDisplayCopies = useProperty(
    'BoolProperty',
    'Modules.SkyBrowser.HideTargetsBrowsersWithGui'
  );

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

  // Hide/show display copies when panel is opened/closed
  useEffect(() => {
    if (shouldHideDisplayCopies) {
      luaApi?.skybrowser.showAllTargetsAndBrowsers(true);
    }

    return () => {
      if (shouldHideDisplayCopies) {
        luaApi?.skybrowser.showAllTargetsAndBrowsers(false);
      }
    };
  }, [shouldHideDisplayCopies, luaApi]);

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
          {t('add-browser.label')}
        </Button>
        <ThemeIcon size={100} variant={'transparent'}>
          <TelescopeIcon size={'100px'} />
        </ThemeIcon>
        <Text ta={'center'} c={'dimmed'} mt={'lg'}>
          {t('add-browser.description')}
        </Text>
      </Stack>
    );
  }

  return (
    <>
      <LoadingOverlay
        visible={!isInSolarSystem}
        overlayProps={{ backgroundOpacity: 1, bg: 'dark.9' }}
        loaderProps={{
          children: <InfoOverlayContent type={'CameraNotInSolarSystem'} />
        }}
        transitionProps={{ transition: 'fade', duration: 500 }}
      />
      <ImageListWrapper />
      <BrowserTabs openWorldWideTelescope={openWorldWideTelescope} />
    </>
  );
}
