import { ActionIcon, CloseIcon, Group, Tooltip } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import {
  DeleteIcon,
  EyeIcon,
  MoveTargetIcon,
  OpenInNewIcon,
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
          <Tooltip label={'Look at target'}>
            <ActionIcon
              onClick={() => luaApi?.skybrowser.adjustCamera(browserId)}
              aria-label={'Look at skybrowser target'}
            >
              <EyeIcon />
            </ActionIcon>
          </Tooltip>
          <Tooltip label={'Move target to center of view'}>
            <ActionIcon
              onClick={() => luaApi?.skybrowser.centerTargetOnScreen(browserId)}
              aria-label={'Move skybrowser target to center of view'}
            >
              <MoveTargetIcon />
            </ActionIcon>
          </Tooltip>
          <Tooltip label={'Zoom in'}>
            <ActionIcon
              onClick={() => zoom(browserId, fov - zoomStep)}
              aria-label={'Zoom in'}
            >
              <ZoomInIcon />
            </ActionIcon>
          </Tooltip>
          <Tooltip label={'Zoom out'}>
            <ActionIcon
              onClick={() => zoom(browserId, fov + zoomStep)}
              aria-label={'Zoom out'}
            >
              <ZoomOutIcon />
            </ActionIcon>
          </Tooltip>
          <Tooltip label={'Remove all images'}>
            <ActionIcon onClick={removeAllImages} aria-label={'Remove all images'}>
              <DeleteIcon />
            </ActionIcon>
          </Tooltip>
          <Tooltip label={'Open telescope view'}>
            <ActionIcon
              onClick={openWorldWideTelescope}
              aria-label={'Open telescope view'}
            >
              <OpenInNewIcon />
            </ActionIcon>
          </Tooltip>
        </ActionIcon.Group>
        <Group>
          <Tooltip label={'Skybrowser settings'}>
            <ActionIcon
              onClick={() => setShowSettings((old) => !old)}
              variant={showSettings ? 'filled' : 'default'}
              aria-label={`${showSettings ? 'Close' : 'Open'} skybrowser settings`}
            >
              <SettingsIcon />
            </ActionIcon>
          </Tooltip>
          <Tooltip label={'Delete browser'}>
            <ActionIcon
              onClick={deleteBrowser}
              color={'red'}
              variant={'light'}
              aria-label={'Delete browser'}
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
