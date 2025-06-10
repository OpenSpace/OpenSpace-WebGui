import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActionIcon,
  Button,
  Divider,
  Group,
  Select,
  Text,
  TextInput,
  Title
} from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { OpenWindowIcon } from '@/icons/icons';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  intializeUserPanels,
  updateRecentWebpanels
} from '@/redux/userpanels/userPanelsSlice';
import { UserPanelsFolderKey, WindowsKey } from '@/util/keys';
import { useWindowLayoutProvider } from '@/windowmanagement/WindowLayout/hooks';

import { UserPanel } from './UserPanel';

export function UserPanelsPanel() {
  const { addWindow } = useWindowLayoutProvider();

  const [selectedPanel, setSelectedPanel] = useState<string | null>(null);
  const [panelURL, setPanelURL] = useState<string>('');
  const [urlPanelTitle, setUrlPanelTitle] = useState<string>('');

  const luaApi = useOpenSpaceApi();
  const {
    isInitialized: isDataInitialized,
    addedWebpanels: addedPanels,
    panels: localPanels
  } = useAppSelector((state) => state.userPanels);

  const { t } = useTranslation('panel-user');
  const dispatch = useAppDispatch();

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

  function addLocalPanel() {
    if (!selectedPanel) {
      return;
    }
    const src = `http://${window.location.host}/webpanels/${selectedPanel}/index.html`;

    addWebPanelWindow(src, selectedPanel);

    setSelectedPanel(null);
  }

  function addWebPanel() {
    if (!panelURL) {
      return;
    }
    const startsWithHttp = panelURL.indexOf('http') === 0;
    const src = startsWithHttp ? panelURL : `http://${panelURL}`;
    const title = urlPanelTitle === '' ? src : urlPanelTitle;

    addWebPanelWindow(src, title);

    setPanelURL('');
    setUrlPanelTitle('');
    dispatch(updateRecentWebpanels({ title: title, src: src }));
  }

  function addWebPanelWindow(src: string, title: string) {
    addWindow(<UserPanel src={src} title={title} />, {
      title: title,
      position: 'right',
      id: title
    });
  }

  return (
    <>
      <Title my={'xs'} order={2}>
        {t('local-panels.title')}
      </Title>
      <Group align={'flex-end'}>
        <Select
          placeholder={t('local-panels.select-panel-placeholder')}
          data={localPanels}
          onChange={setSelectedPanel}
          value={selectedPanel}
          flex={1}
          onKeyDown={(e) => e.key === 'Enter' && addLocalPanel()}
        />
        <ActionIcon
          onClick={addLocalPanel}
          disabled={!selectedPanel}
          size={'lg'}
          aria-label={t('local-panels.aria-label')}
        >
          <OpenWindowIcon />
        </ActionIcon>
      </Group>
      <Divider my={'md'} />
      <Title order={2} my={'xs'}>
        {t('web-panels.title')}
      </Title>
      <TextInput
        value={urlPanelTitle}
        label={t('web-panels.input.title')}
        placeholder={t('web-panels.input.placeholder')}
        onChange={(e) => setUrlPanelTitle(e.target.value)}
      />
      <Group align={'flex-end'} justify={'space-between'}>
        <TextInput
          value={panelURL}
          label={t('web-panels.url.title')}
          placeholder={t('web-panels.url.placeholder')}
          onChange={(e) => setPanelURL(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addWebPanel()}
          flex={1}
          rightSection={
            <ActionIcon
              onClick={addWebPanel}
              disabled={!panelURL}
              size={'lg'}
              aria-label={t('web-panels.url.aria-label')}
            >
              <OpenWindowIcon />
            </ActionIcon>
          }
        />
      </Group>
      <Title mt={'xs'} mb={'xs'} order={3}>
        {t('recently-opened-panels.title')}
      </Title>
      {addedPanels.map((panel) => (
        <Button
          key={`${panel.src}${panel.title}`}
          onClick={() => {
            addWebPanelWindow(panel.src, panel.title);
            dispatch(updateRecentWebpanels({ title: panel.title, src: panel.src }));
          }}
          fullWidth
          mb={'xs'}
        >
          <Text m={'xs'}>{panel.title}</Text>
          <OpenWindowIcon />
        </Button>
      ))}
    </>
  );
}
