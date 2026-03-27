import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Box,
  Button,
  Divider,
  Group,
  Select,
  Tabs,
  TextInput,
  Title,
  Tooltip
} from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { AttentionIcon, OpenInBrowserIcon, OpenWindowIcon, WebIcon } from '@/icons/icons';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  intializeUserPanels,
  updateRecentWebpanels
} from '@/redux/userpanels/userPanelsSlice';
import { IconSize } from '@/types/enums';
import { UserPanelsFolderKey, WindowsKey } from '@/util/keys';
import { useWebGuiUrl } from '@/util/networkingHooks';
import { useWindowLayoutProvider } from '@/windowmanagement/WindowLayout/hooks';

import { UserPanel } from './UserPanel';
import { WebPanelListItem } from './WebpanelListItem';

export function UserPanelsPanel() {
  const { t } = useTranslation('panel-user');

  const {
    isInitialized: isDataInitialized,
    addedWebpanels: addedPanels,
    panels: localPanels
  } = useAppSelector((state) => state.userPanels);

  const [selectedPanel, setSelectedPanel] = useState<string | null>(null);
  const [panelURL, setPanelURL] = useState<string>('');
  const [urlPanelTitle, setUrlPanelTitle] = useState<string>('');

  const { addWindow } = useWindowLayoutProvider();
  const luaApi = useOpenSpaceApi();
  const webGuiUrl = useWebGuiUrl();

  const dispatch = useAppDispatch();

  const bookmarks = [
    { title: 'OpenSpace Hub', src: 'https://hub.openspaceproject.com/' },
    { title: 'ShowComposer', src: `${webGuiUrl}/showcomposer` }
  ];

  useEffect(() => {
    // Collect all folder paths in the USER folder
    async function getUserPanels() {
      if (!luaApi) {
        return;
      }

      const root = await luaApi.absPath(UserPanelsFolderKey);
      const folders = await luaApi.walkDirectoryFolders(root);

      if (!folders) {
        return;
      }
      const isWindowsMachine = navigator.userAgent.indexOf(WindowsKey) !== -1;
      const slash = isWindowsMachine ? '\\' : '/';
      const folderNames = Object.values(folders).map((panel) =>
        // Get the folder name from the path
        panel.substring(panel.lastIndexOf(slash) + 1)
      );
      dispatch(intializeUserPanels(folderNames));
    }

    if (luaApi && !isDataInitialized) {
      getUserPanels();
    }
  }, [dispatch, isDataInitialized, luaApi]);

  function addLocalPanel(inBrowser?: boolean) {
    if (!selectedPanel) {
      return;
    }
    const src = `${webGuiUrl}/webpanels/${selectedPanel}/index.html`;

    if (inBrowser) {
      openInBrowser(src, selectedPanel);
    } else {
      openInNewWindow(src, selectedPanel);
    }

    setSelectedPanel(null);
  }

  function addWebPanel(inBrowser?: boolean) {
    if (!panelURL) {
      return;
    }
    const startsWithHttp = panelURL.indexOf('http') === 0;
    const src = startsWithHttp ? panelURL : `http://${panelURL}`;
    const title = urlPanelTitle === '' ? src : urlPanelTitle;

    if (inBrowser) {
      openInBrowser(src, title);
    } else {
      openInNewWindow(src, title);
    }

    setPanelURL('');
    setUrlPanelTitle('');
  }

  function openInBrowser(src: string, title: string) {
    window.open(src, '_blank');
    dispatch(updateRecentWebpanels({ title, src }));
  }

  function openInNewWindow(src: string, title: string) {
    addWindow(<UserPanel src={src} title={title} />, {
      title: title,
      position: 'right',
      id: title
    });
    dispatch(updateRecentWebpanels({ title, src }));
  }

  return (
    <>
      <Tabs defaultValue={'local'}>
        <Tabs.List>
          <Tabs.Tab value={'local'} leftSection={<OpenWindowIcon size={IconSize.sm} />}>
            {t('local-panels.title')}
          </Tabs.Tab>
          <Tabs.Tab value={'url'} leftSection={<WebIcon size={IconSize.sm} />}>
            {t('web-panels.title')}
          </Tabs.Tab>
        </Tabs.List>

        <Box>
          <Tabs.Panel value={'local'}>
            {localPanels.length === 0 && (
              <Alert mb={'xs'} icon={<AttentionIcon />}>
                {t('local-panels.no-panels')}
              </Alert>
            )}
            <Select
              placeholder={t('local-panels.select-panel-placeholder')}
              data={localPanels}
              disabled={localPanels.length === 0}
              onChange={setSelectedPanel}
              value={selectedPanel}
            />
            <Group mt={'xs'} gap={'xs'}>
              <Tooltip label={t('add-buttons.new-window.tooltip')}>
                <Button
                  onClick={() => addLocalPanel(false)}
                  disabled={!selectedPanel}
                  leftSection={<OpenWindowIcon />}
                >
                  {t('add-buttons.new-window.label')}
                </Button>
              </Tooltip>
              <Tooltip label={t('add-buttons.browser.tooltip')}>
                <Button
                  onClick={() => addLocalPanel(true)}
                  disabled={!selectedPanel}
                  leftSection={<OpenInBrowserIcon />}
                >
                  {t('add-buttons.browser.label')}
                </Button>
              </Tooltip>
            </Group>
          </Tabs.Panel>

          <Tabs.Panel value={'url'}>
            <TextInput
              value={urlPanelTitle}
              label={t('web-panels.input.title')}
              placeholder={t('web-panels.input.placeholder')}
              onChange={(e) => setUrlPanelTitle(e.target.value)}
            />
            <TextInput
              value={panelURL}
              label={t('web-panels.url.title')}
              withAsterisk
              placeholder={t('web-panels.url.placeholder')}
              onChange={(e) => setPanelURL(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addWebPanel()}
              flex={1}
            />
            <Group gap={'xs'} mt={'xs'}>
              <Tooltip label={t('add-buttons.new-window.tooltip')}>
                <Button
                  onClick={() => addWebPanel(false)}
                  disabled={!panelURL}
                  leftSection={<OpenWindowIcon />}
                >
                  {t('add-buttons.new-window.label')}
                </Button>
              </Tooltip>
              <Tooltip label={t('add-buttons.browser.tooltip')}>
                <Button
                  onClick={() => addWebPanel(true)}
                  disabled={!panelURL}
                  leftSection={<OpenInBrowserIcon />}
                >
                  {t('add-buttons.browser.label')}
                </Button>
              </Tooltip>
            </Group>
          </Tabs.Panel>
        </Box>
      </Tabs>
      <Divider my={'xs'} />
      <Title my={'xs'} order={2}>
        {t('bookmarks-title')}
      </Title>
      {bookmarks.map((bookmark) => (
        <WebPanelListItem
          key={`${bookmark.src}${bookmark.title}`}
          title={bookmark.title}
          src={bookmark.src}
          onNewWindow={openInNewWindow}
          onBrowser={openInBrowser}
        />
      ))}

      <Divider my={'xs'} />
      <Title my={'xs'} order={2}>
        {t('recently-opened-title')}
      </Title>
      {addedPanels.map((panel) => (
        <WebPanelListItem
          key={`${panel.src}${panel.title}`}
          title={panel.title}
          src={panel.src}
          onNewWindow={openInNewWindow}
          onBrowser={openInBrowser}
        />
      ))}
    </>
  );
}
