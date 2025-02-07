import { ActionIcon, Chip, Group, Radio, Tooltip } from '@mantine/core';

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

import { useSelectedBrowserFov, useSkyBrowserSelectedImages } from '../hooks';

import { AddedImagesList } from './AddedImagesList';
import { Settings } from './Settings';

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
          <Tooltip label={'Look at target'}>
            <ActionIcon onClick={() => luaApi?.skybrowser.adjustCamera(id)}>
              <EyeIcon />
            </ActionIcon>
          </Tooltip>
          <Tooltip label={'Move target to center of view'}>
            <ActionIcon onClick={() => luaApi?.skybrowser.centerTargetOnScreen(id)}>
              <MoveTargetIcon />
            </ActionIcon>
          </Tooltip>
          <Tooltip label={'Zoom in'}>
            <ActionIcon onClick={() => zoom(id, fov - zoomStep)}>
              <ZoomInIcon />
            </ActionIcon>
          </Tooltip>
          <Tooltip label={'Zoom out'}>
            <ActionIcon onClick={() => zoom(id, fov + zoomStep)}>
              <ZoomOutIcon />
            </ActionIcon>
          </Tooltip>
          <Tooltip label={'Remove all images'}>
            <ActionIcon onClick={removeAllImages}>
              <DeleteIcon />
            </ActionIcon>
          </Tooltip>
          <Tooltip label={'Open Telescope View'}>
            <ActionIcon onClick={openWorldWideTelescope}>
              <OpenInNewIcon />
            </ActionIcon>
          </Tooltip>
        </ActionIcon.Group>

        <Tooltip label={'Settings'}>
          <ActionIcon
            onClick={() => setShowSettings((old) => !old)}
            variant={showSettings ? 'filled' : 'default'}
          >
            <SettingsIcon />
          </ActionIcon>
        </Tooltip>
      </Group>
      {showSettings ? <Settings id={id} /> : <AddedImagesList />}
    </>
  );
}
