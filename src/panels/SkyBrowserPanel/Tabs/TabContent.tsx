import { ActionIcon, Group } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import {
  EyeIcon,
  MoveTargetIcon,
  OpenInNewIcon,
  SettingsIcon,
  DeleteIcon,
  ZoomInIcon,
  ZoomOutIcon
} from '@/icons/icons';
import { useAppSelector } from '@/redux/hooks';

import { useSelectedBrowserFov, useSkyBrowserSelectedImages } from '../hooks';

import { AddedImagesList } from './AddedImagesList';
import { Settings } from './Settings';
import { TabButton } from './TabButton';

interface Props {
  showSettings: boolean;
  setShowSettings: (func: (old: boolean) => boolean) => void;
  openWorldWideTelescope: () => void;
}

export function TabContent({
  showSettings,
  setShowSettings,
  openWorldWideTelescope
}: Props) {
  const selectedImages = useSkyBrowserSelectedImages();
  const id = useAppSelector((state) => state.skybrowser.selectedBrowserId);
  const imageList = useAppSelector((state) => state.skybrowser.imageList);
  const fov = useSelectedBrowserFov();
  const luaApi = useOpenSpaceApi();
  const zoomStep = 5;

  if (fov === undefined || id === '') {
    return <></>;
  }

  function zoom(id: string, fov: number): void {
    if (!id) {
      return;
    }
    luaApi?.skybrowser.stopAnimations(id);
    const newFov = Math.max(fov, 0.01);
    luaApi?.skybrowser.setVerticalFov(id, Number(newFov));
  }

  function removeAllImages(): void {
    if (!id) {
      return;
    }
    selectedImages?.forEach((image) =>
      luaApi?.skybrowser.removeSelectedImageInBrowser(id, imageList[image].url)
    );
  }

  return (
    <>
      <Group justify={'space-between'}>
        <ActionIcon.Group>
          <TabButton
            text={'Look at target'}
            onClick={() => luaApi?.skybrowser.adjustCamera(id)}
          >
            <EyeIcon />
          </TabButton>
          <TabButton
            text={'Move target to center of view'}
            onClick={() => luaApi?.skybrowser.centerTargetOnScreen(id)}
          >
            <MoveTargetIcon />
          </TabButton>
          <TabButton text={'Zoom in'} onClick={() => zoom(id, fov - zoomStep)}>
            <ZoomInIcon />
          </TabButton>
          <TabButton text={'Zoom out'} onClick={() => zoom(id, fov + zoomStep)}>
            <ZoomOutIcon />
          </TabButton>
          <TabButton text={'Remove all images'} onClick={removeAllImages}>
            <DeleteIcon />
          </TabButton>
          <TabButton text={'Open Telescope View'} onClick={openWorldWideTelescope}>
            <OpenInNewIcon />
          </TabButton>
        </ActionIcon.Group>
        <TabButton
          text={'Settings'}
          onClick={() => setShowSettings((old) => !old)}
          variant={showSettings ? 'filled' : 'default'}
        >
          <SettingsIcon />
        </TabButton>
      </Group>
      {showSettings ? <Settings id={id} /> : <AddedImagesList />}
    </>
  );
}
