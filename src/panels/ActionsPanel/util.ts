import { Action, FolderContent } from '@/types/types';

export function actionsForLevel(
  actions: Action[],
  navigationPath: string
): FolderContent {
  const mappedActions: FolderContent = { actions: [], folders: {} };

  // @TODO: (2025-02-07, emmbr), this code collects ALL actions and folders, not only
  // the ones that are on the current level. We should refactor it
  actions.forEach((action) => {
    let { guiPath } = action;
    // If there is no backslash at beginning of GUI path, add that manually
    // (there should always be though)
    if (guiPath.length > 0 && guiPath[0] !== '/') {
      guiPath = `/${guiPath}`;
    }

    // Splite the GUI path up into the individual subfolders..
    // Remove all empty strings: which is what we get before initial slash and
    // if the path is just a slash
    const guiFolders = guiPath.split('/').filter((s) => s !== '');
    const isTopLevelAction = guiFolders.length === 0;

    // Is this is action at the top level, and we're finding the top level actions?
    // Just add it then
    if (isTopLevelAction && navigationPath === '/') {
      mappedActions.actions.push(action);
      return;
    }

    // Add actions of other levels
    let parent = mappedActions;
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

  // @TODO : This code is quite confusing.... It steps thought
  let actionsForPath = mappedActions;
  if (navigationPath.length > 1) {
    const folders = navigationPath.split('/');
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

export function getDisplayedActions(allActions: Action[], navPath: string): Action[] {
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

// Truncate navigation path if too long
export function truncatePath(navigationPath: string): string {
  const NAVPATH_LENGTH_LIMIT = 60;
  const shouldTruncate = navigationPath.length > NAVPATH_LENGTH_LIMIT;

  if (!shouldTruncate) {
    return navigationPath;
  }

  const path = navigationPath.startsWith('/')
    ? navigationPath.substring(1)
    : navigationPath;
  const pieces = path.split('/');

  if (pieces.length > 1) {
    // TODO: maybe keep more pieces of the path, if possible?
    return `/${pieces[0]}/.../${pieces[pieces.length - 1]}`;
  } else {
    // Path with very long folder name
    return navigationPath.substring(0, NAVPATH_LENGTH_LIMIT);
  }
}
