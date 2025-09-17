import { Asset, Folder } from './types';

export function getCurrentFolder(root: Folder, path: string[]): Folder {
  let current = root;
  for (const segment of path) {
    const next = current.subFolders.find((f) => f.name === segment);
    if (!next) {
      break;
    }
    current = next;
  }
  return current;
}

export function collectAssets(folder: Folder): Asset[] {
  // Collect this folders assets
  let assets: Asset[] = [...folder.assets];

  // Recursively collect assets from subfolders
  for (const subFolder of folder.subFolders) {
    assets = assets.concat(collectAssets(subFolder));
  }
  return assets;
}
