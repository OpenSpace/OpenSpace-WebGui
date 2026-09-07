import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActionIcon, Box, Group, Text, Tooltip } from '@mantine/core';

import { FilterList } from '@/components/FilterList/FilterList';
import { Layout } from '@/components/Layout/Layout';
import { LoadingBlocks } from '@/components/LoadingBlocks/LoadingBlocks';
import { useSubscribeToAssetTree } from '@/hooks/topicSubscriptions';
import { FolderBackIcon, RefreshIcon } from '@/icons/icons';
import { rescanAssetTree } from '@/redux/assettree/assetTreeMiddleware';
import { useAppDispatch } from '@/redux/hooks';
import { IconSize } from '@/types/enums';
import { caseInsensitiveSubstring } from '@/util/stringmatcher';

import { AssetEntry } from './AssetEntry/AssetEntry';
import { AssetsBreadcrumbs } from './AssetsBreadcrumbs';
import { FolderEntry } from './FolderEntry';
import { useFolderAssets } from './hooks';
import { Asset } from './types';
import { collectAssets, findNavigatedFolder } from './util';

export function AssetsPanel() {
  const { t } = useTranslation('panel-assets');
  const [currentPath, setCurrentPath] = useState<string[]>([]);

  const dispatch = useAppDispatch();

  const rootFolder = useFolderAssets();
  useSubscribeToAssetTree();

  const navigatedFolder = useMemo(
    () => (rootFolder ? findNavigatedFolder(rootFolder, currentPath) : null),
    [rootFolder, currentPath]
  );

  const nestedAssetsInCurrentFolder = useMemo(
    () => (navigatedFolder ? collectAssets(navigatedFolder) : []),
    [navigatedFolder]
  );

  if (!rootFolder || !navigatedFolder) {
    return <LoadingBlocks />;
  }

  function navigateTo(depth: number) {
    if (!currentPath) {
      return;
    }
    setCurrentPath((path) => path.slice(0, depth));
  }

  function goBack() {
    if (!currentPath) {
      return;
    }
    navigateTo(currentPath.length - 1);
  }

  return (
    <Layout>
      <Layout.FixedSection>
        <AssetsBreadcrumbs navigationPath={currentPath} navigateTo={navigateTo} />
      </Layout.FixedSection>
      <Layout.GrowingSection>
        <FilterList>
          <Group gap={'xs'}>
            <FilterList.InputField
              placeHolderSearchText={t('asset-search-placeholder')}
              flex={1}
            />
            <Tooltip label={<Text>{t('reload-button.tooltip')}</Text>}>
              <ActionIcon
                onClick={() => {
                  dispatch(rescanAssetTree());
                }}
                aria-label={t('reload-button.aria-label')}
                size={'input-sm'}
              >
                <RefreshIcon />
              </ActionIcon>
            </Tooltip>
          </Group>
          <FilterList.Favorites>
            {/* @TODO (anden88 2026-09-04): Add right-click context menu to show folder in
             * explorer as it got a bit too cluttered with having a '...' menu on each
             * folder entry */}
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
                onClick={() => setCurrentPath([...currentPath, folder.name])}
              />
            ))}
            <Box mb={'xs'}>
              {navigatedFolder.assets.map((asset) => (
                <AssetEntry key={asset.path} asset={asset} />
              ))}
            </Box>
          </FilterList.Favorites>

          <FilterList.SearchResults
            data={nestedAssetsInCurrentFolder}
            renderElement={(asset: Asset) => (
              <AssetEntry key={asset.name} asset={asset} />
            )}
            matcherFunc={(asset, search) =>
              search
                .split(' ')
                .filter((term) => term.length > 0)
                .every((term) => caseInsensitiveSubstring(asset.path, term))
            }
          >
            <FilterList.SearchResults.VirtualList />
          </FilterList.SearchResults>
        </FilterList>
      </Layout.GrowingSection>
    </Layout>
  );
}
