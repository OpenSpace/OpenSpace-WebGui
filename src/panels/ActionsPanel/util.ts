export function formatPath(path: string): string {
  let guiPath = path;
  if (path === '/') {
    return path;
  }

  // Ensure that the GUI path starts with a slash (they all should)
  if (!guiPath.startsWith('/')) {
    guiPath = `/${guiPath}`;
  }

  // If there is a trailing slash at the end of the gui path, remove it
  if (guiPath.endsWith('/')) {
    guiPath = guiPath.slice(0, -1);
  }
  return guiPath;
}

// Returns the depth of the path. If path is /, the depth is 0.
// If path is /folder1/folder2, the depth is 2.
export function calculateLevelDepth(navigationPath: string): number {
  if (navigationPath === '/') {
    return 0;
  }
  // Create an array of characters and count the number of slashes
  const charArray = navigationPath.split('');
  const nSlashes = charArray.filter((char) => char === '/').length;
  return nSlashes;
}

// Returns an array of folders from a path. If path is /, the array is [''].
// If path is /folder1/folder2, the array is ['', 'folder1', 'folder2'].
// The first element is always an empty string.
export function getFolders(path: string): string[] {
  if (path === '/') {
    return [''];
  }
  return formatPath(path).split('/');
}

export function createPath(folders: string[]): string {
  return formatPath(folders.join('/'));
}
