import { useTranslation } from 'react-i18next';
import { ActionIcon, CloseIcon, Group, Tooltip } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import {
  DeleteIcon,
  EyeIcon,
  MoveTargetIcon,
  OpenWindowIcon,
  SettingsIcon,
  ZoomInIcon,
  ZoomOutIcon
} from '@/icons/icons';
import { useAppSelector } from '@/redux/hooks';

import { useBrowserFov, useSelectedImages, useSkyBrowserIds } from '../hooks';

import { AddedImagesList } from './AddedImagesList';
import { Settings } from './Settings';

interface Props {
  showSettings: boolean;
  setShowSettings: (func: (old: boolean) => boolean) => void;
  openWorldWideTelescope: () => void;
  browserId: string;
}

export function TabContent({
  showSettings,
  setShowSettings,
  openWorldWideTelescope,
  browserId
}: Props) {
  const { t } = useTranslation('panel-skybrowser', { keyPrefix: 'tab-content' });

  const selectedImages = useSelectedImages(browserId);
  const imageList = useAppSelector((state) => state.skybrowser.imageList);
  const fov = useBrowserFov(browserId);
  const browserIds = useSkyBrowserIds();

  const luaApi = useOpenSpaceApi();
  const zoomStep = 5;

  if (fov === undefined || browserId === '') {
    return <></>;
  }

  function zoom(browserId: string, fov: number): void {
    if (!browserId) {
      return;
    }
    luaApi?.skybrowser.stopAnimations(browserId);
    const newFov = Math.max(fov, 0.01);
    luaApi?.skybrowser.setVerticalFov(browserId, Number(newFov));
  }

  function removeAllImages(): void {
    if (!browserId || !imageList) {
      return;
    }
    selectedImages?.forEach((image) =>
      luaApi?.skybrowser.removeSelectedImageInBrowser(browserId, imageList[image].url)
    );
  }

  function deleteBrowser() {
    if (!browserId) {
      return;
    }
    // If there are more browsers, select another browser
    if (browserIds.length > 1) {
      const otherBrowsers = browserIds.filter((b) => b !== browserId);
      luaApi?.skybrowser.setSelectedBrowser(otherBrowsers[0]);
    }
    luaApi?.skybrowser.removeTargetBrowserPair(browserId);
  }

  return (
    <>
      <Group justify={'space-between'}>
        <ActionIcon.Group>
          <Tooltip label={t('look-at-skybrowser.tooltip')}>
            <ActionIcon
              onClick={() => luaApi?.skybrowser.adjustCamera(browserId)}
              aria-label={t('look-at-skybrowser.aria-label')}
            >
              <EyeIcon />
            </ActionIcon>
          </Tooltip>
          <Tooltip label={t('center-skybrowser.tooltip')}>
            <ActionIcon
              onClick={() => luaApi?.skybrowser.centerTargetOnScreen(browserId)}
              aria-label={t('center-skybrowser.aria-label')}
            >
              <MoveTargetIcon />
            </ActionIcon>
          </Tooltip>
          <Tooltip label={t('zoom-in')}>
            <ActionIcon
              onClick={() => zoom(browserId, fov - zoomStep)}
              aria-label={t('zoom-in')}
            >
              <ZoomInIcon />
            </ActionIcon>
          </Tooltip>
          <Tooltip label={t('zoom-out')}>
            <ActionIcon
              onClick={() => zoom(browserId, fov + zoomStep)}
              aria-label={t('zoom-out')}
            >
              <ZoomOutIcon />
            </ActionIcon>
          </Tooltip>
          <Tooltip label={t('remove-all-images')}>
            <ActionIcon onClick={removeAllImages} aria-label={t('remove-all-images')}>
              <DeleteIcon />
            </ActionIcon>
          </Tooltip>
          <Tooltip label={t('open-telescope-view')}>
            <ActionIcon
              onClick={openWorldWideTelescope}
              aria-label={t('open-telescope-view')}
            >
              <OpenWindowIcon />
            </ActionIcon>
          </Tooltip>
        </ActionIcon.Group>
        <Group>
          <Tooltip label={t('skybrowser-settings.label')}>
            <ActionIcon
              onClick={() => setShowSettings((old) => !old)}
              variant={showSettings ? 'filled' : 'default'}
              aria-label={`${
                showSettings
                  ? t('skybrowser-settings.aria-label.close')
                  : t('skybrowser-settings.aria-label.open')
              }`}
            >
              <SettingsIcon />
            </ActionIcon>
          </Tooltip>
          <Tooltip label={t('skybrowser-settings.delete-browser')}>
            <ActionIcon
              onClick={deleteBrowser}
              color={'red'}
              variant={'light'}
              aria-label={t('skybrowser-settings.delete-browser')}
            >
              <CloseIcon />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Group>
      {showSettings ? <Settings id={browserId} /> : <AddedImagesList id={browserId} />}
    </>
  );
}
