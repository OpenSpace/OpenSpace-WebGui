import { AssetState } from 'openspace-api-js/types';

export interface Asset {
  /**
   *Absolute path
   */
  path: string;
  /**
   * Path using a token such as ${ASSETS} or ${USER_ASSETS}, if no matching token is found
   * the absolute path is used instead
   */
  portablePath: string;
  name: string;
}

export interface Folder {
  path: string;
  name: string;
  subFolders: Folder[];
  assets: Asset[];
}

export interface AssetFolderNavigationState {
  root: Folder;
  currentPath: string[];
}

export type AssetLoadingState = AssetState['state'];
