import { Action } from '@/types/types';

export interface ActionFolderContent {
  actions: Action[];
  folders: string[];
}

export function actionsForLevel(
  actions: Action[],
  navigationPath: string
): ActionFolderContent {
  const mappedActions: ActionFolderContent = { actions: [], folders: [] };
  const levelDepth = navigationPath.split('/').filter((s) => s.length > 0).length;

  // Find all actions and folders that match the current navigation path
  actions.forEach((action) => {
    let { guiPath } = action;

    // Ensure that the GUI path starts with a slash (they all should)
    if (guiPath.length > 0 && guiPath[0] !== '/') {
      guiPath = `/${guiPath}`;
    }

    if (!guiPath.startsWith(navigationPath)) {
      return;
    }

    if (guiPath === navigationPath) {
      mappedActions.actions.push(action);
      return;
    }

    // Add all the subfolders to the folders list. Unfortunately we currently have to do
    // this based on the GUI paths of all the remaining actions
    // @TODO (2025-02-07, emmbr): This is not very efficient, but it works for now. Better
    // would be to prepare the data in a more structured way in the Redux store

    const splitPath = guiPath.split('/');
    if (splitPath.length <= levelDepth) {
      return;
    }
    const folderName = splitPath[levelDepth + 1];
    if (folderName && !mappedActions.folders.includes(folderName)) {
      mappedActions.folders.push(folderName);
    }
  });

  return mappedActions;
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
