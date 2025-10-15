import { Asset, Folder } from './types';

/**
 * Traverse the folder hierarchy from the given root according to the specified path,
 * returning the folder at that location
 *
 * @param root The folder to begin traversal from
 * @param navPath An array of folder names representing the path to traverse
 * @returns The folder located at the given path, or the last valid folder if the path is
 * incomplete
 */
export function findNavigatedFolder(root: Folder, navPath: string[]): Folder {
  let current = root;
  for (const segment of navPath) {
    const next = current.subFolders.find((f) => f.name === segment);
    if (!next) {
      break;
    }
    current = next;
  }
  return current;
}

/**
 * Recursively collect all assets from the given folder and its subfolders
 *
 * @param folder The root folder to collect assets from
 * @returns An array containing all assets within the folder and its descendants
 */
export function collectAssets(folder: Folder): Asset[] {
  // Collect this folders assets
  let assets: Asset[] = [...folder.assets];

  // Recursively collect assets from subfolders
  for (const subFolder of folder.subFolders) {
    assets = assets.concat(collectAssets(subFolder));
  }
  return assets;
}

/**
 * Extracts and returns the final segment (file or folder name) from a given path
 *
 * @param path The full path string (e.g., "C:/foo/bar" or "C:/foo/bar.asset")
 * @returns The final name segment of the path (e.g., "bar" or "bar.asset")
 */
export function baseName(path: string): string {
  const sanitizedPath = path.replaceAll('\\', '/');
  const nameStartPos = sanitizedPath.lastIndexOf('/');

  return sanitizedPath.substring(nameStartPos + 1);
}

/**
 * Recursively prune empty folders from data structure. Empty folders are those
 * without subfolders or assets
 * @param folder to potentially prune
 * @returns a pruned Folder version without empty subfolders
 */
export function pruneEmptyFolders(folder: Folder): Folder | null {
  // Recursively prune subfolders
  const prunedSubFolders = folder.subFolders
    .map(pruneEmptyFolders)
    .filter((folder) => folder !== null);

  const prunedFolder: Folder = {
    ...folder,
    subFolders: prunedSubFolders
  };

  // Folder is empty if it has no subfolders or any assets
  if (prunedFolder.subFolders.length === 0 && prunedFolder.assets.length === 0) {
    return null;
  }

  return prunedFolder;
}
