import { useEffect, useState } from 'react';
import {
  ActionIcon,
  Button,
  Container,
  Divider,
  Group,
  ScrollArea,
  Select,
  Text,
  TextInput,
  Title
} from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { OpenWindowIcon } from '@/icons/icons';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { intializeUserPanels, openWebpanel } from '@/redux/userpanels/userPanelsSlice';
import { UserPanelsFolderKey, WindowsKey } from '@/util/keys';
import { useWindowLayoutProvider } from '@/windowmanagement/WindowLayout/hooks';

import { UserPanel } from './UserPanel';

export function UserPanelsPanel() {
  const { addWindow } = useWindowLayoutProvider();

  const [selectedPanel, setSelectedPanel] = useState<string | null>(null);
  const [panelURL, setPanelURL] = useState<string>('');
  const [urlPanelTitle, setUrlPanelTitle] = useState<string>('');

  const luaApi = useOpenSpaceApi();
  const isDataInitialized = useAppSelector((state) => state.userPanels.isInitialized);
  const addedPanels = useAppSelector((state) => state.userPanels.addedWebpanels);

  const localPanels = useAppSelector((state) => state.userPanels.panels);
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
    // TODO (ylvse) 2024-12-04: Change this back to window.location.host once we no longer
    // serve the gui on port 4670 (the webpanels are served on port 4680)
    // const src = `http://${window.location.host}/webpanels/${panelName}/index.html`;
    const src = `http://localhost:4680/webpanels/${selectedPanel}/index.html`;

    openPanel(src, selectedPanel);

    setSelectedPanel(null);
  }

  function addWebPanel() {
    if (!panelURL) {
      return;
    }
    const startsWithHttp = panelURL.indexOf('http') === 0;
    const src = startsWithHttp ? panelURL : `http://${panelURL}`;
    const title = urlPanelTitle === '' ? src : urlPanelTitle;

    openPanel(src, title);

    setPanelURL('');
    setUrlPanelTitle('');
    dispatch(openWebpanel({ title: title, src: src }));
  }

  function openPanel(src: string, title: string) {
    addWindow(<UserPanel src={src} title={title} />, {
      title: title,
      position: 'right',
      id: title
    });
  }

  return (
    <ScrollArea h={'100%'}>
      <Container>
        <Title my={'xs'} order={2}>
          User Panels
        </Title>
        <Title my={'xs'} order={3}>
          Open Local Panel
        </Title>
        <Group align={'flex-end'}>
          <Select
            placeholder={'Select panel'}
            data={localPanels}
            onChange={setSelectedPanel}
            value={selectedPanel}
            flex={1}
            onKeyDown={(e) => e.key === 'Enter' && addLocalPanel()}
          />
          <ActionIcon onClick={addLocalPanel} disabled={!selectedPanel} size={'lg'}>
            <OpenWindowIcon />
          </ActionIcon>
        </Group>
        <Divider my={'md'} />
        <Title order={3} my={'xs'}>
          Open from URL
        </Title>
        <TextInput
          value={urlPanelTitle}
          label={'Title (optional)'}
          placeholder={'Input title (optional)'}
          onChange={(e) => setUrlPanelTitle(e.target.value)}
        />
        <Group align={'flex-end'} justify={'space-between'}>
          <TextInput
            value={panelURL}
            label={'URL'}
            placeholder={'Input URL'}
            onChange={(e) => setPanelURL(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addWebPanel()}
            flex={1}
            rightSection={
              <ActionIcon onClick={addWebPanel} disabled={!panelURL} size={'lg'}>
                <OpenWindowIcon />
              </ActionIcon>
            }
          />
        </Group>
        <Title mt={'xs'} mb={'xs'} order={4}>
          Recently Opened URLs
        </Title>
        {addedPanels.map((panel) => (
          <Button
            key={`${panel.src}${panel.title}`}
            onClick={() => openPanel(panel.src, panel.title)}
            fullWidth
            mb={'xs'}
          >
            <Text m={'xs'}>{panel.title}</Text>
            <OpenWindowIcon />
          </Button>
        ))}
      </Container>
    </ScrollArea>
  );
}
