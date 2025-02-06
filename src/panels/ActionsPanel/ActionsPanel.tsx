import {
  ActionIcon,
  Box,
  Button,
  Container,
  Group,
  ScrollArea,
  Text
} from '@mantine/core';

import { DynamicGrid } from '@/components/DynamicGrid/DynamicGrid';
import { FilterList } from '@/components/FilterList/FilterList';
import { generateMatcherFunctionByKeys } from '@/components/FilterList/util';
import { BackArrowIcon, FolderIcon } from '@/icons/icons';
import { setActionsPath } from '@/redux/actions/actionsSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { Action, FolderContent } from '@/types/types';

import { ActionsButton } from './ActionsButton';
import { actionsForLevel, getDisplayedActions, truncatePath } from './util';

import './ActionsPanel.css';

export function ActionsPanel() {
  const allActions = useAppSelector((state) => state.actions.actions);
  const navigationPath = useAppSelector((state) => state.actions.navigationPath);
  const isInitialized = useAppSelector((state) => state.actions.isInitialized);

  const dispatch = useAppDispatch();

  const actionLevel = actionsForLevel(allActions, navigationPath, isInitialized);
  const displayedNavigationPath = truncatePath(navigationPath);
  const displayedActions = getDisplayedActions(allActions, navigationPath);

  function addNavPath(path: string): void {
    let navString = navigationPath;
    if (navigationPath === '/') {
      navString += path;
    } else {
      navString += `/${path}`;
    }
    dispatch(setActionsPath(navString));
  }

  function goBack(): void {
    let navString = navigationPath;
    navString = navString.substring(0, navString.lastIndexOf('/'));
    if (navString.length === 0) {
      navString = '/';
    }
    dispatch(setActionsPath(navString));
  }

  function goToPath(path: string): void {
    const index = navigationPath.indexOf(path);
    // If we don't find the path e.g., when '...' is displayed go back one step
    if (index === -1) {
      goBack();
      return;
    }
    let navPath = navigationPath.substring(0, index + path.length);
    if (navPath.length === 0) {
      navPath = '/';
    }
    dispatch(setActionsPath(navPath));
  }

  function getFoldersContent(level: FolderContent): React.JSX.Element[] {
    return Object.keys(level.folders)
      .sort()
      .map((key) => displayFolderButton(key));
  }

  function getActionContent(level: FolderContent): React.JSX.Element[] | null {
    if (level.actions.length === 0) {
      return null;
    }

    return level.actions.map((action: Action) => (
      <DynamicGrid.Col key={`${action.identifier}_action`}>
        <ActionsButton action={action} />
      </DynamicGrid.Col>
    ));
  }

  function displayFolderButton(key: string): React.JSX.Element {
    return (
      <DynamicGrid.Col key={key}>
        <Button
          leftSection={<FolderIcon />}
          onClick={() => addNavPath(key)}
          fullWidth
          h={80} // TODO anden88 2025-02-06: use same css variable as ActionsButton
        >
          <Text style={{ whiteSpace: 'wrap', wordBreak: 'break-all' }}>{key}</Text>
        </Button>
      </DynamicGrid.Col>
    );
  }

  function displayBackButton(): React.JSX.Element {
    if (navigationPath !== '/') {
      return (
        <ActionIcon onClick={goBack} key={'backbtn'}>
          <BackArrowIcon />
        </ActionIcon>
      );
    }
    return <></>;
  }

  function displayNavigationPath(): React.JSX.Element {
    if (displayedNavigationPath === '/') {
      // Just display the backslash without any click events
      return (
        <Text display={'inline'} style={{ cursor: 'default' }}>
          {displayedNavigationPath}
        </Text>
      );
    }
    const split = displayedNavigationPath.split('/');
    const paths = split.map((path) => (
      <Text
        key={path}
        onClick={() => goToPath(path)}
        display={'inline'}
        style={{ cursor: 'pointer' }}
      >
        {path}/
      </Text>
    ));

    return <Box flex={1}>{paths}</Box>;
  }

  if (actionLevel === undefined) {
    return <p>Loading...</p>;
  }

  // TODO (ylvse 2024-10-10) Check what this check is meant to do?
  // In the js it is actionlevel.length === 0. But how can it have a length?
  const isEmpty = actionLevel === null;
  const actions = isEmpty ? <div>No Actions</div> : getActionContent(actionLevel);
  const folders = isEmpty ? <div>No Folders</div> : getFoldersContent(actionLevel);
  return (
    <ScrollArea h={'100%'}>
      <Container>
        <Group gap={'xs'} my={'xs'}>
          {displayBackButton()}
          {displayNavigationPath()}
        </Group>
        <FilterList>
          <FilterList.InputField placeHolderSearchText={'Search for an action...'} />
          <FilterList.Favorites>
            <DynamicGrid gutter={'xs'} minChildSize={150} className={'actionsPanelGrid'}>
              {folders}
              {actions}
            </DynamicGrid>
          </FilterList.Favorites>
          <FilterList.Data<Action>
            data={displayedActions}
            renderElement={(action: Action) => (
              <ActionsButton key={`${action.identifier}Filtered`} action={action} />
            )}
            matcherFunc={generateMatcherFunctionByKeys(['identifier', 'name', 'guiPath'])}
          />
        </FilterList>
      </Container>
    </ScrollArea>
  );
}
