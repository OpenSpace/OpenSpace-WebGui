import { ActionIcon, Group } from '@mantine/core';
import { TabButton } from './TabButton';
import {
  EyeIcon,
  MoveTargetIcon,
  OpenInNewIcon,
  SettingsIcon,
  TrashIcon,
  ZoomInIcon,
  ZoomOutIcon
} from '@/icons/icons';
import { SelectedImagesList } from './SelectedImagesList';
import { Settings } from './Settings';
import { useOpenSpaceApi } from '@/api/hooks';
import { useAppSelector } from '@/redux/hooks';
import { useSelectedBrowserFov, useSkyBrowserSelectedImages } from '../hooks';

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

  if (fov === undefined || id === undefined) {
    return null;
  }

  function zoom(id: string, fov: number) {
    luaApi?.skybrowser.stopAnimations(id);
    const newFov = Math.max(fov, 0.01);
    luaApi?.skybrowser.setVerticalFov(id, Number(newFov));
  }

  function removeAllImages() {
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
          <TabButton text={'Zoom in'} onClick={() => zoom(id, fov - 5)}>
            <ZoomInIcon />
          </TabButton>
          <TabButton text={'Zoom out'} onClick={() => zoom(id, fov + 5)}>
            <ZoomOutIcon />
          </TabButton>
          <TabButton text={'Remove all images'} onClick={removeAllImages}>
            <TrashIcon />
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
      {showSettings ? <Settings id={id} /> : <SelectedImagesList />}
    </>
  );
}
