export interface Asset {
  path: string;
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
