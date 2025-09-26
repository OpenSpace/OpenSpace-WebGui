import { useEffect, useState } from 'react';

import { useOpenSpaceApi } from '@/api/hooks';

import { Asset, Folder } from './types';

export function useAssetFolders() {
  const luaApi = useOpenSpaceApi();
  const [rootFolder, setRootFolder] = useState<Folder | null>(null);

  useEffect(() => {
    /**
     * Returns the folder name or file name of a given a path
     * e.g., C:/foo/bar -> bar and C:/foo/bar.asset -> bar.asset
     */
    function pathName(path: string): string {
      const sanitizedPath = path.replaceAll('\\', '/');
      const nameStartPos = sanitizedPath.lastIndexOf('/');

      const name = sanitizedPath.substring(nameStartPos + 1);
      return name;
    }

    /**
     * Recursively fetch all folders and assets in a given directory
     * @param directoryPath Directory to fetch folders and assets from
     * @returns A nested Folder
     */
    async function fetchFolderData(directoryPath: string): Promise<Folder> {
      const name = pathName(directoryPath);

      let subFolderPaths = await luaApi?.walkDirectoryFolders(directoryPath);
      let assetsPaths = await luaApi?.walkDirectoryFiles(directoryPath);

      subFolderPaths = subFolderPaths ? Object.values(subFolderPaths) : [];
      assetsPaths = assetsPaths
        ? Object.values(assetsPaths).filter((path) => path.endsWith('.asset'))
        : [];

      const assets: Asset[] =
        assetsPaths.map((path) => ({
          path,
          name: pathName(path)
        })) ?? [];

      const subFolders: Folder[] = subFolderPaths
        ? await Promise.all(subFolderPaths.map((path) => fetchFolderData(path)))
        : [];

      return {
        path: directoryPath,
        name: name,
        subFolders: subFolders,
        assets: assets
      };
    }

    /**
     * Recursively prune empty folders from data structure. Empty folders are those
     * without subfolders or assets
     * @param folder to potentially prune
     * @returns a pruned Folder version without empty subfolders
     */
    function pruneEmptyFolders(folder: Folder): Folder | null {
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

    async function buildFolderStructure() {
      const rootFolder: Folder = {
        path: '',
        name: 'Home',
        subFolders: [],
        assets: []
      };
      // eslint-disable-next-line no-template-curly-in-string
      const dataDir = await luaApi?.absPath('${ASSETS}');
      // eslint-disable-next-line no-template-curly-in-string
      const userDir = await luaApi?.absPath('${USER_ASSETS}');
      if (dataDir) {
        let dataFolder: Folder | null = await fetchFolderData(dataDir);
        dataFolder = pruneEmptyFolders(dataFolder);

        if (dataFolder) {
          dataFolder.name = 'OpenSpace assets';
          rootFolder.subFolders.push(dataFolder);
        }
      }
      
      if (userDir) {
        let userFolder: Folder | null = await fetchFolderData(userDir);
        userFolder = pruneEmptyFolders(userFolder);
        
        if (userFolder) {
          userFolder.name = 'User assets';
          rootFolder.subFolders.push(userFolder);
        }
      }

      setRootFolder(rootFolder);
    }

    buildFolderStructure();
  }, [luaApi]);

  return rootFolder;
}
