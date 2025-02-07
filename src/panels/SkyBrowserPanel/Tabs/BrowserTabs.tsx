import { useState } from 'react';
import { ActionIcon, ColorSwatch, Group, Tabs } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { PlusIcon } from '@/icons/icons';
import { useAppSelector } from '@/redux/hooks';

import { useSkyBrowserColors, useSkyBrowserIds, useSkyBrowserNames } from '../hooks';

import { TabContent } from './TabContent';

interface Props {
  openWorldWideTelescope: () => void;
}

export function BrowserTabs({ openWorldWideTelescope }: Props) {
  const [showSettings, setShowSettings] = useState(false);
  const browsersIds = useSkyBrowserIds();
  const browserNames = useSkyBrowserNames();
  const browserColors = useSkyBrowserColors();
  const selectedBrowserId = useAppSelector((state) => {
    return state.skybrowser.selectedBrowserId;
  });
  const luaApi = useOpenSpaceApi();

  return (
    <Tabs
      variant={'outline'}
      value={selectedBrowserId}
      onChange={(id) => {
        if (id) {
          luaApi?.skybrowser.setSelectedBrowser(id);
          setShowSettings(false);
        }
      }}
      mt={'lg'}
    >
      {/* Tabs */}
      <Tabs.List>
        {Object.values(browsersIds).map((id, i) => (
          <Tabs.Tab value={id} key={id}>
            <Group>
              {browserNames[i]}
              <ColorSwatch
                color={browserColors[i] ? `rgb(${browserColors[i].join(',')}` : 'gray'}
                size={12}
              />
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

      {/* Tab content */}
      {browsersIds.map((id) => (
        <Tabs.Panel key={id} value={id} m={'xs'}>
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
