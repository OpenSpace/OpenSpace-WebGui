import {
  EyeIcon,
  SettingsIcon,
  MoveTargetIcon,
  ZoomInIcon,
  ZoomOutIcon,
  TrashIcon
} from '@/icons/icons';
import { useAppSelector } from '@/redux/hooks';
import { ActionIcon, Group, Tabs } from '@mantine/core';
import { TabButton } from './TabButton';
import { useState } from 'react';
import { Settings } from './Settings';
import { SelectedImagesList } from './SelectedImagesList';
import { useOpenSpaceApi } from '@/api/hooks';
export function BrowserTabs() {
  const [showSettings, setShowSettings] = useState(false);
  const browsers = useAppSelector((state) => state.skybrowser.browsers);
  const imageList = useAppSelector((state) => state.skybrowser.imageList);
  const selectedBrowser = useAppSelector((state) => state.skybrowser.selectedBrowserId);
  const selectedImages = useAppSelector(
    (state) => state.skybrowser.browsers[selectedBrowser].selectedImages
  );
  const luaApi = useOpenSpaceApi();

  function zoom(id: string, fov: number) {
    luaApi?.skybrowser.stopAnimations(id);
    const newFov = Math.max(fov, 0.01);
    luaApi?.skybrowser.setVerticalFov(id, Number(newFov));
  }

  function removeAllImages() {
    selectedImages.forEach((image) =>
      luaApi?.skybrowser.removeSelectedImageInBrowser(
        selectedBrowser,
        imageList[image].url
      )
    );
  }

  return (
    <Tabs
      variant="outline"
      value={browsers[selectedBrowser].id}
      onChange={(id) => id && luaApi?.skybrowser.setSelectedBrowser(id)}
      mt={'lg'}
    >
      <Tabs.List>
        {Object.values(browsers).map((browser) => (
          <Tabs.Tab key={browser.id} value={browser.id}>
            {browser.name}
          </Tabs.Tab>
        ))}
      </Tabs.List>
      {Object.values(browsers).map((browser) => (
        <Tabs.Panel key={browser.id} value={browser.id} m={'xs'}>
          <Group justify="space-between">
            <ActionIcon.Group>
              <TabButton
                text={'Look at target'}
                onClick={() => luaApi?.skybrowser.adjustCamera(browser.id)}
              >
                <EyeIcon />
              </TabButton>
              <TabButton
                text={'Move target to center of view'}
                onClick={() => luaApi?.skybrowser.centerTargetOnScreen(browser.id)}
              >
                <MoveTargetIcon />
              </TabButton>
              <TabButton
                text={'Zoom in'}
                onClick={() => zoom(browser.id, browser.fov - 5)}
              >
                <ZoomInIcon />
              </TabButton>
              <TabButton
                text={'Zoom out'}
                onClick={() => zoom(browser.id, browser.fov + 5)}
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
          {showSettings ? <Settings /> : <SelectedImagesList />}
        </Tabs.Panel>
      ))}
    </Tabs>
  );
}
