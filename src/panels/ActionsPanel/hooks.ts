import { useMemo } from 'react';

import { useAppSelector } from '@/redux/hooks';
import { Action } from '@/types/types';

export interface ActionFolderContent {
  actions: Action[];
  folders: string[];
}

export function useActionsForLevel(): ActionFolderContent {
  const actions = useAppSelector((state) => state.actions.actions);
  const navigationPath = useAppSelector((state) => state.actions.navigationPath);

  const levelDepth = navigationPath.split('/').filter((s) => s.length > 0).length;

  // Find all actions and folders that match the current navigation path
  const mappedActions = useMemo(() => {
    const mappedActions: ActionFolderContent = { actions: [], folders: [] };

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
  }, [actions, navigationPath, levelDepth]);

  return mappedActions;
}

export function useActionsInPath(): Action[] {
  const allActions = useAppSelector((state) => state.actions.actions);
  const navigationPath = useAppSelector((state) => state.actions.navigationPath);

  // If we are at root path every action matches
  if (navigationPath === '/') {
    return allActions;
  }

  // We want to include the subfolders of the current path
  // Hence we check if the GUI path starts with the navigation path
  return allActions.filter((action) => action.guiPath.startsWith(navigationPath));
}
