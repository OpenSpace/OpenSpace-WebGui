import { ActionIcon, Group } from '@mantine/core';
import { TabButton } from './TabButton';
import {
  EyeIcon,
  MoveTargetIcon,
  SettingsIcon,
  TrashIcon,
  ZoomInIcon,
  ZoomOutIcon
} from '@/icons/icons';
import { SelectedImagesList } from './SelectedImagesList';
import { Settings } from './Settings';
import { useOpenSpaceApi } from '@/api/hooks';
import { useAppSelector } from '@/redux/hooks';

interface Props {
  showSettings: boolean;
  setShowSettings: (func: (old: boolean) => boolean) => void;
}

export function TabContent({ showSettings, setShowSettings }: Props) {
  const luaApi = useOpenSpaceApi();
  const selectedBrowser = useAppSelector((state) => {
    return state.skybrowser.browsers?.[state.skybrowser.selectedBrowserId] ?? null;
  });
  const imageList = useAppSelector((state) => state.skybrowser.imageList);

  function zoom(id: string, fov: number) {
    luaApi?.skybrowser.stopAnimations(id);
    const newFov = Math.max(fov, 0.01);
    luaApi?.skybrowser.setVerticalFov(id, Number(newFov));
  }

  function removeAllImages() {
    selectedBrowser?.selectedImages.forEach((image) =>
      luaApi?.skybrowser.removeSelectedImageInBrowser(
        selectedBrowser.id,
        imageList[image].url
      )
    );
  }

  return (
    <>
      <Group justify={'space-between'}>
        <ActionIcon.Group>
          <TabButton
            text={'Look at target'}
            onClick={() => luaApi?.skybrowser.adjustCamera(selectedBrowser.id)}
          >
            <EyeIcon />
          </TabButton>
          <TabButton
            text={'Move target to center of view'}
            onClick={() => luaApi?.skybrowser.centerTargetOnScreen(selectedBrowser.id)}
          >
            <MoveTargetIcon />
          </TabButton>
          <TabButton
            text={'Zoom in'}
            onClick={() => zoom(selectedBrowser.id, selectedBrowser.fov - 5)}
          >
            <ZoomInIcon />
          </TabButton>
          <TabButton
            text={'Zoom out'}
            onClick={() => zoom(selectedBrowser.id, selectedBrowser.fov + 5)}
          >
            <ZoomOutIcon />
          </TabButton>
          <TabButton text={'Remove all images'} onClick={removeAllImages}>
            <TrashIcon />
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
      {showSettings ? <Settings id={selectedBrowser?.id} /> : <SelectedImagesList />}
    </>
  );
}
