import {
  EyeIcon,
  SettingsIcon,
  MoveTargetIcon,
  ZoomInIcon,
  ZoomOutIcon,
  TrashIcon
} from '@/icons/icons';
import { useAppSelector } from '@/redux/hooks';
import { ActionIcon, Button, Group, Popover, Text, Tabs } from '@mantine/core';
import { TabButton } from './TabButton';
import { useState } from 'react';
import { Settings } from './Settings';
import { SelectedImagesList } from './SelectedImagesList';
import { useOpenSpaceApi } from '@/api/hooks';
export function BrowserTabs() {
  const [showSettings, setShowSettings] = useState(false);
  const browsers = useAppSelector((state) => state.skybrowser.browsers);
  const selectedBrowser = useAppSelector((state) => state.skybrowser.selectedBrowserId);
  const luaApi = useOpenSpaceApi();

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
          <Group>
            <ActionIcon.Group>
              <TabButton
                text={'Look at target'}
                onClick={() => console.log('look at target')}
              >
                <EyeIcon />
              </TabButton>
              <TabButton
                text={'Move target to center of view'}
                onClick={() => console.log('remove')}
              >
                <MoveTargetIcon />
              </TabButton>
              <TabButton text={'Zoom in'} onClick={() => console.log('remove')}>
                <ZoomInIcon />
              </TabButton>
              <TabButton text={'Zoom out'} onClick={() => console.log('remove')}>
                <ZoomOutIcon />
              </TabButton>
              <TabButton text={'Remove all images'} onClick={() => console.log('remove')}>
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
