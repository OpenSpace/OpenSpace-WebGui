import { Action, Folder } from "@/types/types";

export function actionsForLevel(
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
export function truncatePath(navigationPath: string) {
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