import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useAppSelector } from '@/redux/hooks';

import { Folder } from './types';
import { buildFolder } from './util';

/**
 * Builds a complete folder structure tree with subfolders and assets for all available
 * assets in the user `Data` and `User` directories. The asset paths are already tokenized
 * (e.g., '${ASSETS}/examples/spheres.asset') by OpenSpace, so the token is used directly to
 * build the folder hierarchy.
 *
 * @returns Folder data tree with subfolders and assets.
 */
export function useFolderAssets(): Folder {
  const { t } = useTranslation('panel-assets', { keyPrefix: 'folder-names' });

  const shipped = useAppSelector((state) => state.assetTree.shipped);
  const user = useAppSelector((state) => state.assetTree.user);
  const other = useAppSelector((state) => state.assetTree.other);

  return useMemo(() => {
    const subFolders = [
      // eslint-disable-next-line no-template-curly-in-string
      buildFolder(shipped, t('built-in'), '${ASSETS}'),
      // eslint-disable-next-line no-template-curly-in-string
      buildFolder(user, t('user'), '${USER_ASSETS}')
    ];

    if (other.length > 0) {
      subFolders.push(buildFolder(other, t('other')));
    }

    const rootFolder: Folder = { path: '', name: 'Home', subFolders, assets: [] };

    return rootFolder;
  }, [shipped, user, other, t]);
}
