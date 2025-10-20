import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useOpenSpaceApi } from '@/api/hooks';

import { Asset, Folder } from './types';
import { baseName, pruneEmptyFolders } from './util';

export function useAssetFolders() {
  const [folderStructure, setFolderStructure] = useState<Folder | null>(null);
  const luaApi = useOpenSpaceApi();
  const { t } = useTranslation('panel-assets', { keyPrefix: 'folder-names' });

  /**
   * Recursively fetch all folders and assets in a given directory
   * @param directoryPath Directory to fetch folders and assets from
   * @returns A nested Folder
   */
  const fetchFolderData = useCallback(
    async (directoryPath: string): Promise<Folder> => {
      const name = baseName(directoryPath);

      let subFolderPaths = await luaApi?.walkDirectoryFolders(directoryPath);
      let assetsPaths = await luaApi?.walkDirectoryFiles(directoryPath);

      subFolderPaths = subFolderPaths ? Object.values(subFolderPaths) : [];
      assetsPaths = assetsPaths
        ? Object.values(assetsPaths).filter((path) => path.endsWith('.asset'))
        : [];

      const assets: Asset[] =
        assetsPaths.map((path) => ({
          path,
          name: baseName(path)
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
    },
    [luaApi]
  );

  const buildFolderStructure = useCallback(async () => {
    if (!luaApi) {
      return;
    }

    const rootFolder: Folder = {
      path: '',
      name: 'Home',
      subFolders: [],
      assets: []
    };

    // eslint-disable-next-line no-template-curly-in-string
    const dataDir = await luaApi.absPath('${ASSETS}');
    // eslint-disable-next-line no-template-curly-in-string
    const userDir = await luaApi.absPath('${USER_ASSETS}');
    if (dataDir) {
      let dataFolder: Folder | null = await fetchFolderData(dataDir);
      dataFolder = pruneEmptyFolders(dataFolder);

      if (dataFolder) {
        dataFolder.name = t('built-in');
        rootFolder.subFolders.push(dataFolder);
      }
    }

    if (userDir) {
      let userFolder: Folder | null = await fetchFolderData(userDir);
      userFolder = pruneEmptyFolders(userFolder);

      // Ensure user folder is present even if empty
      if (!userFolder) {
        userFolder = {
          path: userDir,
          name: '',
          subFolders: [],
          assets: []
        };
      }

      userFolder.name = t('user');
      rootFolder.subFolders.push(userFolder);
    }

    setFolderStructure(rootFolder);
  }, [luaApi, fetchFolderData, t]);

  useEffect(() => {
    buildFolderStructure();
  }, [buildFolderStructure]);

  return folderStructure;
}
