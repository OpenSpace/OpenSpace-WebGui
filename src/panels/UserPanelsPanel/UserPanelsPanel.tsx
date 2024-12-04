import { useEffect, useState } from 'react';
import {
  Button,
  Container,
  Divider,
  Group,
  Select,
  Text,
  TextInput,
  Title
} from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { UserPageIcon } from '@/icons/icons';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { intializeUserPages } from '@/redux/userpages/userpagesSlice';
import { useWindowManagerProvider } from '@/windowmanagement/WindowLayout/hooks';

import { UserPage } from './UserPanel';

export function UserPanelsPanel() {
  const { addWindow } = useWindowManagerProvider();

  const [selectedPanel, setSelectedPanel] = useState<string | null>(null);
  const [panelURL, setPanelURL] = useState<string>('');
  const [urlPanelTitle, setUrlPanelTitle] = useState<string>('');

  const luaApi = useOpenSpaceApi();
  const isDataInitialized = useAppSelector((state) => state.userPages.isInitialized);

  const localPanels = useAppSelector((state) => state.userPages.panels || []);
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Collect all folder paths in the USER folder
    const getUserPanels = async () => {
      if (!luaApi) return;

      // eslint-disable-next-line no-template-curly-in-string
      const root = await luaApi.absPath('${USER}/webpanels');
      const folders = await luaApi.walkDirectoryFolders(root);

      if (!folders) return;

      const slash = navigator.platform.indexOf('Win') > -1 ? '\\' : '/';
      const folderNames = Object.values(folders).map((panel) =>
        // Get the folder name from the path
        panel.substr(panel.lastIndexOf(slash) + 1)
      );
      dispatch(intializeUserPages({ panels: folderNames, isInitialized: true }));
    };

    if (luaApi && !isDataInitialized) {
      getUserPanels();
    }
  }, [dispatch, isDataInitialized, luaApi]);

  function addLocalPanel() {
    if (!selectedPanel) return;
    // TODO (ylvse) 2024-12-04: Change this back to window.location.host once we no longer
    // serve the gui on port 4670 (the webpanels are served on port 4680)
    // const src = `http://${window.location.host}/webpanels/${panelName}/index.html`;
    const src = `http://localhost:4680/webpanels/${selectedPanel}/index.html`;

    addWindow(<UserPage src={src} title={selectedPanel} />, {
      title: selectedPanel,
      position: 'right',
      id: selectedPanel
    });
    setSelectedPanel(null);
  }

  function addWebPanel() {
    if (!panelURL) return;
    const startsWithHttp = panelURL.indexOf('http') === 0;
    const src = startsWithHttp ? panelURL : `http://${panelURL}`;
    // As of now, we don't have titles for the URLs so we just use the URL
    const title = urlPanelTitle === '' ? src : urlPanelTitle;

    addWindow(<UserPage src={src} title={title} />, {
      title: title,
      position: 'right',
      id: title
    });

    setPanelURL('');
    setUrlPanelTitle('');
  }

  return (
    <Container>
      <Title my={'xs'} order={4}>
        User Panels
      </Title>
      <Title order={5}>Add Local Panel</Title>
      <Group align={'flex-end'}>
        <Select
          placeholder={'Select Panel'}
          data={localPanels}
          onChange={setSelectedPanel}
          value={selectedPanel}
          flex={3}
          onKeyDown={(e) => e.key === 'Enter' && addLocalPanel()}
        />
        <Button onClick={addLocalPanel} disabled={!selectedPanel} p={'xs'}>
          <UserPageIcon />
          <Text mx={'xs'}>Add</Text>
        </Button>
      </Group>
      <Divider my={'md'} />
      <Title order={5}>Add from URL</Title>
      <TextInput
        value={urlPanelTitle}
        label={'Title (optional)'}
        placeholder={'Input Title (optional)'}
        onChange={(evt) => setUrlPanelTitle(evt.target.value)}
      />
      <Group align={'flex-end'} justify={'space-between'}>
        <TextInput
          value={panelURL}
          label={'URL'}
          placeholder={'Input URL'}
          onChange={(evt) => setPanelURL(evt.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addWebPanel()}
          flex={3}
        />
        <Button onClick={addWebPanel} disabled={!panelURL} p={'xs'}>
          <UserPageIcon />
          <Text mx={'xs'}>Add</Text>
        </Button>
      </Group>
    </Container>
  );
}
