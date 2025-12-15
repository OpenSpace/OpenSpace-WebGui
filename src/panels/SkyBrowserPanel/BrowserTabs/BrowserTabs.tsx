import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActionIcon, Center, Tabs, Tooltip } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { PlusIcon } from '@/icons/icons';
import { useAppSelector } from '@/redux/hooks';
import { IconSize } from '@/types/enums';

import { useSkyBrowserColors, useSkyBrowserIds, useSkyBrowserNames } from '../hooks';

import { TabContent } from './TabContent';

interface Props {
  openWorldWideTelescope: () => void;
}

export function BrowserTabs({ openWorldWideTelescope }: Props) {
  const { t } = useTranslation('panel-skybrowser', { keyPrefix: 'browser-tabs' });

  const selectedBrowserId = useAppSelector((state) => state.skybrowser.selectedBrowserId);

  const [showSettings, setShowSettings] = useState(false);

  const browsersIds = useSkyBrowserIds();
  const browserNames = useSkyBrowserNames();
  const browserColors = useSkyBrowserColors();
  const luaApi = useOpenSpaceApi();

  return (
    <Tabs
      value={selectedBrowserId}
      onChange={(id) => {
        if (id) {
          luaApi?.skybrowser.setSelectedBrowser(id);
          setShowSettings(false);
        }
      }}
      mt={'sm'}
    >
      {/* Tabs */}
      <Tabs.List>
        {Object.values(browsersIds).map((id, i) => (
          <Tabs.Tab
            value={id}
            key={id}
            color={browserColors[i] ? `rgb(${browserColors[i].join(',')}` : 'gray'}
          >
            {browserNames[i]}
          </Tabs.Tab>
        ))}
        <Tooltip label={t('new-browser-tooltip')}>
          <Center>
            <ActionIcon
              size={'sm'}
              m={'xs'}
              variant={'subtle'}
              color={'gray'}
              onClick={() => luaApi?.skybrowser.createTargetBrowserPair()}
            >
              <PlusIcon size={IconSize.xs} />
            </ActionIcon>
          </Center>
        </Tooltip>
      </Tabs.List>

      {/* Tab content */}
      {browsersIds.map((id) => (
        <Tabs.Panel key={id} value={id} my={'xs'}>
          <TabContent
            showSettings={showSettings}
            setShowSettings={setShowSettings}
            openWorldWideTelescope={openWorldWideTelescope}
            browserId={id}
          />
        </Tabs.Panel>
      ))}
    </Tabs>
  );
}
