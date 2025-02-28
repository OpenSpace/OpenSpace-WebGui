import { useMemo } from 'react';

import { setActionsPath } from '@/redux/actions/actionsSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { Action } from '@/types/types';

import { calculateLevelDepth, createPath, formatPath,getFolders } from './util';

export interface ActionFolderContent {
  actions: Action[];
  folders: string[];
}

export function useActionsForLevel(): ActionFolderContent {
  const actions = useAppSelector((state) => state.actions.actions);
  const navigationPath = useAppSelector((state) =>
    formatPath(state.actions.navigationPath)
  );

  // If we are at home, this will be 0. If we are at /folder1/folder2, this will be 2.
  const currentDepth = calculateLevelDepth(navigationPath);

  // Find all actions and folders that match the current navigation path
  const mappedActions = useMemo(() => {
    const mappedActions: ActionFolderContent = { actions: [], folders: [] };

    actions.forEach((action) => {
      // We want to make sure all paths are in the same format. Prune it.
      const guiPath = formatPath(action.guiPath);

      // Is it the current path? Add it to actions
      if (guiPath === navigationPath) {
        mappedActions.actions.push(action);
        return;
      }

      // Add all the subfolders to the folders list. Unfortunately we currently have to do
      // this based on the GUI paths of all the remaining actions.
      // @TODO (2025-02-07, emmbr): This is not very efficient, but it works for now. Better
      // would be to prepare the data in a more structured way in the Redux store
      const isInSubfolder =
        guiPath.startsWith(navigationPath) && calculateLevelDepth(guiPath) > currentDepth;
      if (!isInSubfolder) {
        return;
      }
      // Get the folder name of the current depth.
      // getFolders returns an array that starts with "" for home, so we need to add 1 to the depth
      const folderName = getFolders(guiPath)[currentDepth + 1];

      // We should add the folder to the list of folders if it is not already there
      if (folderName && !mappedActions.folders.includes(folderName)) {
        mappedActions.folders.push(folderName);
      }
    });
    return mappedActions;
  }, [actions, navigationPath, currentDepth]);

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

export function useGoToFolder() {
  const navigationPath = useAppSelector((state) => state.actions.navigationPath);

  const dispatch = useAppDispatch();

  return function goToFolder(folder: string): void {
    const newPath = getFolders(navigationPath);
    newPath.push(folder);
    dispatch(setActionsPath(createPath(newPath)));
  };
}
