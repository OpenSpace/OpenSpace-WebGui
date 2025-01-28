import { useState } from 'react';
import { ActionIcon, ColorSwatch, Group, Tabs } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { PlusIcon } from '@/icons/icons';
import { useAppSelector } from '@/redux/hooks';

import { TabContent } from './TabContent';

interface Props {
  openWorldWideTelescope: () => void;
}

export function BrowserTabs({ openWorldWideTelescope }: Props) {
  const [showSettings, setShowSettings] = useState(false);
  const browsers = useAppSelector((state) => state.skybrowser.browsers);
  const selectedBrowser = useAppSelector((state) => {
    return state.skybrowser.browsers?.[state.skybrowser.selectedBrowserId] ?? null;
  });
  const luaApi = useOpenSpaceApi();

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
            color={`rgb(${selectedBrowser?.color.join(',')}`}
            key={browser.id}
          >
            <Group>
              {browser.name}
              <ColorSwatch color={`rgb(${browser?.color.join(',')}`} size={12} />
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
          <TabContent
            showSettings={showSettings}
            setShowSettings={setShowSettings}
            openWorldWideTelescope={openWorldWideTelescope}
          />
        </Tabs.Panel>
      ))}
    </Tabs>
  );
}
