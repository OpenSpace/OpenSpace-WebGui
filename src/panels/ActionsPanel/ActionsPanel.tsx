import {
  ActionIcon,
  Button,
  Container,
  Flex,
  Grid,
  Group,
  ScrollArea
} from '@mantine/core';

import { FilterList } from '@/components/FilterList/FilterList';
import { generateMatcherFunctionByKeys } from '@/components/FilterList/util';
import { BackArrowIcon, FolderIcon } from '@/icons/icons';
import { setActionsPath } from '@/redux/actions/actionsSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { Action, FolderContent } from '@/types/types';

import { ActionsButton } from './ActionsButton';
import { actionsForLevel, getDisplayedActions, truncatePath } from './util';

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

  function folderButton(key: string): React.JSX.Element {
    return (
      <Button leftSection={<FolderIcon />} onClick={() => addNavPath(key)} key={key}>
        {key}
      </Button>
    );
  }

  function getFoldersContent(level: FolderContent) {
    return Object.keys(level.folders)
      .sort()
      .map((key) => folderButton(key));
  }

  function getActionContent(level: FolderContent) {
    if (level.actions.length === 0) {
      return null;
    }

    return level.actions.map((action: Action) => (
      <ActionsButton key={`${action.identifier}Action`} action={action} />
    ));
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

  if (actionLevel === undefined) {
    return <p>Loading...</p>;
  }
  // TODO (ylvse 2024-10-10) Check what this check is meant to do?
  // In the js it is actionlevel.length === 0. But how can it have a length?
  const isEmpty = actionLevel === null;
  const actions = isEmpty ? <div>No Actions</div> : getActionContent(actionLevel);
  const folders = isEmpty ? <div>No Folders</div> : getFoldersContent(actionLevel);
  return (
    <Container>
      <ScrollArea h={'100%'}>
        <Group gap={'xs'}>
          {displayBackButton()}
          <p>{`${displayedNavigationPath}`}</p>
        </Group>
        <FilterList>
          <FilterList.InputField placeHolderSearchText={'Search for an action...'} />
          <FilterList.Favorites>
            <Grid>
              {folders}
              {actions}
            </Grid>
          </FilterList.Favorites>
          <FilterList.Data<Action>
            data={displayedActions}
            renderElement={(action: Action) => (
              <ActionsButton key={`${action.identifier}Filtered`} action={action} />
            )}
            matcherFunc={generateMatcherFunctionByKeys(['identifier', 'name', 'guiPath'])}
          />
        </FilterList>
      </ScrollArea>
    </Container>
  );
}
