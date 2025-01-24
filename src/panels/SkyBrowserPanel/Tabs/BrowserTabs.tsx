import { useState } from 'react';
import { ActionIcon, ColorSwatch, Group, Tabs } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import {
  EyeIcon,
  MoveTargetIcon,
  PlusIcon,
  SettingsIcon,
  TrashIcon,
  ZoomInIcon,
  ZoomOutIcon
} from '@/icons/icons';
import { useAppSelector } from '@/redux/hooks';

import { SelectedImagesList } from './SelectedImagesList';
import { Settings } from './Settings';
import { TabButton } from './TabButton';
export function BrowserTabs() {
  const [showSettings, setShowSettings] = useState(false);
  const browsers = useAppSelector((state) => state.skybrowser.browsers);
  const imageList = useAppSelector((state) => state.skybrowser.imageList);
  const selectedBrowser = useAppSelector((state) => {
    return state.skybrowser.browsers?.[state.skybrowser.selectedBrowserId] ?? null;
  });

  const luaApi = useOpenSpaceApi();

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
    <Tabs
      variant={'outline'}
      value={selectedBrowser?.id}
      onChange={(id) => {
        if (id) {
          luaApi?.skybrowser.setSelectedBrowser(id);
          setShowSettings(false);
        }
      }}
      mt={'lg'}
    >
      <Tabs.List>
        {Object.values(browsers).map((browser) => (
          <Tabs.Tab
            value={browser.id}
            color={`rgb(${selectedBrowser.color.join(',')}`}
            key={browser.id}
          >
            <Group>
              {browser.name}
              <ColorSwatch color={`rgb(${browser.color.join(',')}`} size={12} />
            </Group>
          </Tabs.Tab>
        ))}
        <ActionIcon
          variant={'default'}
          size={'lg'}
          onClick={() => luaApi?.skybrowser.createTargetBrowserPair()}
        >
          <PlusIcon />
        </ActionIcon>
      </Tabs.List>
      {Object.values(browsers).map((browser) => (
        <Tabs.Panel key={browser.id} value={browser.id} m={'xs'}>
          <Group justify={'space-between'}>
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
          {showSettings ? <Settings id={selectedBrowser?.id} /> : <SelectedImagesList />}
        </Tabs.Panel>
      ))}
    </Tabs>
  );
}
