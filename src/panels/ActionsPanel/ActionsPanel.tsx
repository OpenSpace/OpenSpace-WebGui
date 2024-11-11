import { Button, Flex, Grid } from '@mantine/core';
import { Action } from 'src/types/types';

import { FolderIcon } from '@/icons/icons';
import { FilterList } from '@/components/FilterList/FilterList';
import { FilterListData } from '@/components/FilterList/FilterListData';
import { setActionsPath } from '@/redux/actions/actionsSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';

import { ActionsButton } from './ActionsButton';
import { FilterListFavorites } from '@/components/FilterList/FilterListFavorites';
import { objectOrStringWordBeginningSubString } from '@/components/FilterList/util';

interface FolderContent {
  actions: Action[];
  folders: Folder;
}

interface Folder {
  [key: string]: FolderContent;
}

function actionsForLevel(
  actions: Action[],
  navigationPath: string,
  isInitialized: boolean
) {
  const actionsMapped: Folder = { '/': { actions: [], folders: {} } };
  if (!isInitialized) {
    return actionsMapped['/'];
  }
  actions.forEach((action) => {
    // If there is no backslash at beginning of GUI path, add that manually
    // (there should always be though)
    let actionGuiPath = action.guiPath;
    if (action.guiPath.length > 0 && action.guiPath[0] !== '/') {
      actionGuiPath = `/${action.guiPath}`;
    }

    let guiFolders = actionGuiPath.split('/');
    // Remove all empty strings: which is what we get before initial slash and
    // if the path is just a slash
    guiFolders = guiFolders.filter((s) => s !== '');

    // Add to top level actions (no gui path)
    if (guiFolders.length === 0) {
      actionsMapped['/'].actions.push(action);
    }

    // Add actions of other levels
    let parent = actionsMapped['/'];
    while (guiFolders.length > 0) {
      const folderName = guiFolders.shift();
      if (folderName === undefined) {
        throw 'Foldername was undefined! Typescript conversion need some look over';
      }
      if (!(folderName in parent.folders)) {
        parent.folders[folderName] = { actions: [], folders: {} };
      }
      if (guiFolders.length === 0) {
        parent.folders[folderName].actions.push(action);
      } else {
        parent = parent.folders[folderName];
      }
    }
  });

  const navPath = navigationPath;
  let actionsForPath = actionsMapped['/'];
  if (navPath.length > 1) {
    const folders = navPath.split('/');
    folders.shift();
    while (folders.length > 0) {
      const folderName = folders.shift();
      if (folderName === undefined) {
        throw 'Foldername was undefined! Typescript conversion need some look over';
      }
      actionsForPath = actionsForPath.folders[folderName];
    }
  }
  return actionsForPath;
}

// Truncate navigation path if too long
function truncatePath(navigationPath: string) {
  const NAVPATH_LENGTH_LIMIT = 60;
  const shouldTruncate = navigationPath.length > NAVPATH_LENGTH_LIMIT;

  let truncatedPath = navigationPath;
  if (shouldTruncate) {
    let originalPath = navigationPath;
    if (originalPath[0] === '/') {
      originalPath = originalPath.substring(1);
    }
    const pieces = originalPath.split('/');
    if (pieces.length > 1) {
      // TODO: maybe keep more pieces of the path, if possible?
      truncatedPath = `/${pieces[0]}/.../${pieces[pieces.length - 1]}`;
    } else {
      truncatedPath = navigationPath.substring(0, NAVPATH_LENGTH_LIMIT);
    }
  }

  return truncatedPath;
}

function getDisplayedActions(allActions: Action[], navPath: string) {
  return allActions.filter((action) => {
    if (navPath.length === 1) {
      return true;
    }
    const navPathGui = navPath.split('/');
    const actionPathGui = action.guiPath?.split('/');
    for (let i = 0; i < navPathGui.length; i++) {
      if (actionPathGui?.[i] !== navPathGui[i]) {
        return false;
      }
    }
    return true;
  });
}

export function ActionsPanel() {
  const allActions = useAppSelector((state) => state.actions.actions);
  const navigationPath = useAppSelector((state) => state.actions.navigationPath);
  const isInitialized = useAppSelector((state) => state.actions.isInitialized);

  const dispatch = useAppDispatch();

  const actionLevel = actionsForLevel(allActions, navigationPath, isInitialized);
  const displayedNavigationPath = truncatePath(navigationPath);
  const displayedActions = getDisplayedActions(allActions, navigationPath);

  function actionPath(action: string) {
    dispatch(setActionsPath(action));
  }

  function addNavPath(path: string) {
    let navString = navigationPath;
    if (navigationPath === '/') {
      navString += path;
    } else {
      navString += `/${path}`;
    }
    actionPath(navString);
  }

  function goBack() {
    let navString = navigationPath;
    navString = navString.substring(0, navString.lastIndexOf('/'));
    if (navString.length === 0) {
      navString = '/';
    }
    actionPath(navString);
  }

  function folderButton(key: string) {
    return (
      <Button onClick={() => addNavPath(key)} key={key}>
        <FolderIcon />
        <p>{key}</p>
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
  // TODO: (@ylvse 2024-10-15): implement this when we have filterlist
  function getAllActions() {
    return displayedActions.map((action: Action) => (
      <ActionsButton key={`${action.identifier}Filtered`} action={action} />
    ));
  }

  function getBackButton() {
    if (navigationPath !== '/') {
      return (
        <Button onClick={goBack} key="backbtn">
          Back
        </Button>
      );
    }
    return null;
  }

  if (actionLevel === undefined) {
    //return <p>Loading...</p>;
  }
  // TODO (ylvse 2024-10-10) Check what this check is meant to do?
  // In the js it is actionlevel.length === 0. But how can it have a length?
  const isEmpty = actionLevel === null;
  const actions = isEmpty ? <div>No Actions</div> : getActionContent(actionLevel);
  const folders = isEmpty ? <div>No Folders</div> : getFoldersContent(actionLevel);
  const backButton = getBackButton();
  return (
    <>
      <Flex>
        {backButton}
        <p>{`${displayedNavigationPath}`}</p>
      </Flex>
      <FilterList>
        <FilterListFavorites>
          <Grid>
            {folders}
            {actions}
          </Grid>
        </FilterListFavorites>
        <FilterListData<Action>
          data={displayedActions}
          renderElement={(action: Action) => (
            <ActionsButton key={`${action.identifier}Filtered`} action={action} />
          )}
          matcherFunc={objectOrStringWordBeginningSubString}
        />
      </FilterList>
    </>
  );
}
