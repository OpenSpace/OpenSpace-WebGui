import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { FilterList } from '@/components/FilterList/FilterList';
import { Layout } from '@/components/Layout/Layout';
import { LoadingBlocks } from '@/components/LoadingBlocks/LoadingBlocks';
import { FolderBackIcon } from '@/icons/icons';
import { IconSize } from '@/types/enums';

import { AssetsBreadcrumbs } from './AssetsBreadcrumbs';
import { AssetsEntry } from './AssetsEntry';
import { FolderEntry } from './FolderEntry';
import { useAssetFolders } from './hooks';
import { Asset, AssetFolderNavigationState } from './types';
import { collectAssets, findNavigatedFolder } from './util';

export function AssetsFolderPanel() {
  const rootFolder = useAssetFolders();
  const [nav, setNav] = useState<AssetFolderNavigationState>();
  const { t } = useTranslation('panel-assets');

  useEffect(() => {
    if (rootFolder) {
      setNav({
        root: rootFolder,
        currentPath: []
      });
    }
  }, [rootFolder]);

  if (!nav) {
    return <LoadingBlocks />;
  }

  const navigatedFolder = findNavigatedFolder(nav.root, nav.currentPath);
  const nestedAssetsInCurrentFolder = collectAssets(navigatedFolder);

  function wordInString(test: Asset, search: string): boolean {
    return test.path.toLowerCase().includes(search.toLowerCase());
  }

  function navigateTo(depth: number) {
    if (!nav) {
      return;
    }
    setNav({ ...nav, currentPath: nav.currentPath.slice(0, depth) });
  }

  function goBack() {
    if (!nav) {
      return;
    }

    navigateTo(nav.currentPath.length - 1);
  }

  return (
    <Layout>
      <Layout.FixedSection>
        <AssetsBreadcrumbs navigationPath={nav.currentPath} navigateTo={navigateTo} />
      </Layout.FixedSection>
      <Layout.GrowingSection>
        <FilterList>
          <FilterList.InputField placeHolderSearchText={t('asset-search-placeholder')} />
          <FilterList.Favorites>
            {navigatedFolder !== rootFolder && (
              <FolderEntry
                text={'..'}
                onClick={goBack}
                icon={<FolderBackIcon size={IconSize.sm} />}
              />
            )}
            {navigatedFolder.subFolders.map((folder) => (
              <FolderEntry
                key={folder.path}
                text={folder.name}
                onClick={() =>
                  setNav({ ...nav, currentPath: [...nav.currentPath, folder.name] })
                }
              />
            ))}

            {navigatedFolder.assets.map((asset) => (
              <AssetsEntry key={asset.path} asset={asset} />
            ))}
          </FilterList.Favorites>

          <FilterList.SearchResults
            data={nestedAssetsInCurrentFolder.sort((a, b) =>
              a.name.localeCompare(b.name)
            )}
            renderElement={(asset: Asset) => (
              <AssetsEntry key={asset.name} asset={asset} />
            )}
            matcherFunc={wordInString}
          >
            <FilterList.SearchResults.VirtualList />
          </FilterList.SearchResults>
        </FilterList>
      </Layout.GrowingSection>
    </Layout>
  );
}
