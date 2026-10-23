import { Asset, Folder } from './types';

export function normalizePath(path: string): string {
  return path.replaceAll('\\', '/');
}

/**
 * Strip the root part of the path from `path` e.g.,
 * path = 'C:/user/openspace/data/assets/foo.asset' and root = 'C:/user/openspace/data'
 * the resulting path is 'assets/foo.asset'
 *
 * @param path The path to strip root path from
 * @param root The root path to strip
 * @returns The relative path from root
 */
export function stripRoot(path: string, root: string): string {
  const normalizedPath = normalizePath(path);
  const normalizedRoot = normalizePath(root);
  if (normalizedRoot.length > 0 && normalizedPath.startsWith(normalizedRoot)) {
    return normalizedPath.substring(normalizedRoot.length).replace(/^\/+/, '');
  }
  return normalizedPath;
}

/**
 * Replaces the root part of `path` with `token` e.g.,
 * path = 'C:/user/data/assets/foo.asset', root = 'C:/user/data/assets' and
 * token = '${ASSETS}' gives '${ASSETS}/foo.asset'. If the path is not located under the
 * root, the path is returned unmodified.
 *
 * @param path The absolute path to convert
 * @param root The absolute path that `token` resolves to
 * @param token The token to replace the root with
 * @returns The path starting with the token
 */
export function tokenizePath(path: string, root: string, token: string): string {
  const normalizedPath = normalizePath(path);
  const normalizedRoot = normalizePath(root).replace(/\/+$/, '');
  if (normalizedRoot.length > 0 && normalizedPath.startsWith(`${normalizedRoot}/`)) {
    return `${token}${normalizedPath.substring(normalizedRoot.length)}`;
  }
  return path;
}

/**
 * Builds a nested Folder structure from a flat list of absolute asset paths.
 *
 * @param paths Absolute paths to '.asset' and '.jasset' files. Paths are assumed to be
 * normalized
 * @param root Directory to strip from each path before building the hierarchy. If
 * omitted, the full path (including drive/leading segments) is used as-is. The root path
 * is assumed to be normalized. If omitted (undefined), the asset paths are added as a
 * flat list to the first folder
 * @param name Name to give the resulting root Folder node
 * @param token Token that resolves to `root`, used to make the asset paths portable
 * between machines. If omitted, the absolute path is used unmodified
 * @returns A nested Folder structure from the given path list
 */
export function buildFolder(
  paths: string[],
  root: string | undefined,
  name: string,
  token?: string
): Folder {
  const folder: Folder = { path: root ?? '', name, subFolders: [], assets: [] };

  function toAsset(path: string): Asset {
    return {
      path,
      portablePath: root && token ? tokenizePath(path, root, token) : path,
      name: baseName(path)
    };
  }

  // If there is no root we'll put everything as a flat list in the first folder
  if (!root) {
    folder.assets = paths.map(toAsset);
    return folder;
  }

  for (const path of paths) {
    // We do not want to include the root path in the panel to show up as folders
    // i.e., 'C:/Foo/../OpenSpace/data/assets' and 'C:/Foo/../OpenSpace/user/data/assets'
    const relativePath = root ? stripRoot(path, root) : path;
    const parts = relativePath.split('/').filter((p) => p.length > 0);

    let currentFolder: Folder = folder;
    let currentPath: string = root ?? '';
    // Navigate to the correct folder and add the asset paths
    for (let i = 0; i < parts.length - 1; i++) {
      currentPath = `${currentPath}/${parts[i]}`;
      let next = currentFolder.subFolders.find((folder) => folder.name === parts[i]);
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
