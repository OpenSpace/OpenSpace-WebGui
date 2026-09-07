import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useOpenSpaceApi } from '@/api/hooks';
import { useAppSelector } from '@/redux/hooks';

import { Folder } from './types';
import { buildFolder, normalizePath } from './util';

/**
 * This hook fetches the absolute paths to the root asset folders `Data` and `User`.
 *
 * @returns The absolute paths to the root asset folder.
 */
function useRootPaths(): { data: string; user: string } | null {
  const [roots, setRoots] = useState<{ data: string; user: string } | null>(null);
  const luaApi = useOpenSpaceApi();

  useEffect(() => {
    let cancelled = false;

    async function fetchRoots() {
      if (!luaApi) {
        return;
      }

      // eslint-disable-next-line no-template-curly-in-string
      const dataDir = normalizePath(await luaApi.absPath('${ASSETS}'));
      // eslint-disable-next-line no-template-curly-in-string
      const userDir = normalizePath(await luaApi.absPath('${USER_ASSETS}'));

      if (!cancelled) {
        setRoots({ data: dataDir, user: userDir });
      }
    }

    fetchRoots();
    return () => {
      cancelled = true;
    };
  }, [luaApi]);

  return roots;
}

/**
 * Builds a complete folder structure tree with subfolders and assets for all available
 * assets in the user `Data` and `User` directories.
 *
 * @returns Folder data tree with subfolders and assets, or null if not yet ready.
 */
export function useFolderAssets(): Folder | null {
  const { t } = useTranslation('panel-assets', { keyPrefix: 'folder-names' });
  const shipped = useAppSelector((state) => state.assetTree.shipped);
  const user = useAppSelector((state) => state.assetTree.user);
  const other = useAppSelector((state) => state.assetTree.other);
  const roots = useRootPaths();

  return useMemo(() => {
    if (!roots) {
      return null;
    }

    const subFolders = [
      buildFolder(shipped, roots.data, t('built-in')),
      buildFolder(user, roots.user, t('user'))
    ];

    if (other.length > 0) {
      subFolders.push(buildFolder(other, undefined, t('other')));
    }

    const rootFolder: Folder = { path: '', name: 'Home', subFolders, assets: [] };

    return rootFolder;
  }, [roots, shipped, user, other, t]);
}
