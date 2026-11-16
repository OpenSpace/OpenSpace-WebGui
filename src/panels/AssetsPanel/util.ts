import { Asset, Folder } from './types';

export function normalizePath(path: string): string {
  return path.replaceAll('\\', '/');
}

/**
 * Builds a nested Folder structure from a flat list of asset paths.
 *
 * @param paths Paths to '.asset' and '.jasset' files. Paths are assumed to be normalized
 * and, if a `token` is provided, to start with that token (e.g., '${ASSETS}/examples/spheres.asset')
 * @param name Name to give the resulting root Folder node
 * @param token Token prefix (e.g., '${ASSETS}') that is stripped from each path before
 * building the hierarchy. If omitted, the full path is used as-is and the assets are
 * added as a flat list to the first folder
 * @returns A nested Folder structure from the given path list
 */
export function buildFolder(paths: string[], name: string, token?: string): Folder {
  const folder: Folder = { path: token ?? '', name, subFolders: [], assets: [] };

  function toAsset(path: string): Asset {
    return {
      path,
      name: baseName(path)
    };
  }

  // If there is no token we'll put everything as a flat list in the first folder
  if (!token) {
    folder.assets = paths.map(toAsset);
    return folder;
  }

  for (const path of paths) {
    // Strip the leading token (e.g., '${ASSETS}/') so that only the path relative to the
    // token root shows up as folders in the panel
    const relativePath = path.startsWith(`${token}/`)
      ? path.substring(token.length + 1)
      : path;
    const parts = relativePath.split('/').filter((p) => p.length > 0);

    let currentFolder: Folder = folder;
    let currentPath: string = token;
    // Navigate to the correct folder and add the asset paths
    for (let i = 0; i < parts.length - 1; i++) {
      currentPath = `${currentPath}/${parts[i]}`;
      let next = currentFolder.subFolders.find(
        (subFolder) => subFolder.name === parts[i]
      );
      if (!next) {
        next = { path: currentPath, name: parts[i], subFolders: [], assets: [] };
        currentFolder.subFolders.push(next);
      }
      currentFolder = next;
    }
    currentFolder.assets.push(toAsset(path));
  }

  return folder;
}

/**
 * Traverse the folder hierarchy from the given root according to the specified path,
 * returning the folder at that location.
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
 * Recursively collect all assets from the given folder and its subfolders.
 *
 * @param folder The root folder to collect assets from
 * @returns An array containing all assets within the folder and its descendants sorted
 * by name
 */
export function collectAssets(folder: Folder): Asset[] {
  function internalCollectAssets(folder: Folder): Asset[] {
    // Collect this folders assets
    let assets: Asset[] = [...folder.assets];

    // Recursively collect assets from subfolders
    for (const subFolder of folder.subFolders) {
      assets = assets.concat(internalCollectAssets(subFolder));
    }
    return assets;
  }

  const assets = internalCollectAssets(folder);
  return assets.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Extracts and returns the final segment (file or folder name) from a given path.
 *
 * @param path The full path string (e.g., "C:/foo/bar" or "C:/foo/bar.asset")
 * @returns The final name segment of the path (e.g., "bar" or "bar.asset")
 */
export function baseName(path: string): string {
  const sanitizedPath = normalizePath(path);
  const nameStartPos = sanitizedPath.lastIndexOf('/');

  return sanitizedPath.substring(nameStartPos + 1);
}
