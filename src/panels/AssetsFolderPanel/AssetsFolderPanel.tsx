import { useEffect, useState } from 'react';
import { Button, Divider, Stack, Text, Title } from '@mantine/core';

import { FolderIcon } from '@/icons/icons';

import { DynamicGrid } from '../../components/DynamicGrid/DynamicGrid';
import { LoadingBlocks } from '../../components/LoadingBlocks/LoadingBlocks';

import { useAssetFolders } from './hooks';
import { Asset, AssetFolderNavigationState } from './types';
import { collectAssets, getCurrentFolder } from './util';
import { AssetsBreadcrumbs } from './AssetsBreadcrumbs';
import { Layout } from '../../components/Layout/Layout';
import { FilterList } from '../../components/FilterList/FilterList';
import { useWindowSize } from '@/windowmanagement/Window/hooks';
import { useOpenSpaceApi } from '@/api/hooks';
import { AssetButton } from './AssetButton';
import { useTranslation } from 'react-i18next';

export function AssetsFolderPanel() {
  const luaApi = useOpenSpaceApi();
  const rootFolder = useAssetFolders();
  const [nav, setNav] = useState<AssetFolderNavigationState>();
  const { width } = useWindowSize();
  const { t } = useTranslation('panel-assets');

  const cardWidth = 170;
  const maxColumns = 10;
  const columns = Math.max(Math.min(Math.floor(width / cardWidth), maxColumns), 1);

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

  const currentFolder = getCurrentFolder(nav.root, nav.currentPath);
  const nestedAssetsInCurrentFolder = collectAssets(currentFolder);

  function loadAsset(asset: Asset): void {
    luaApi?.asset.add(asset.path);
  }

  function wordInString(test: Asset, search: string): boolean {
    return test.path.toLowerCase().includes(search.toLowerCase());
  }

  return (
    <Layout>
      <Layout.FixedSection>
        <AssetsBreadcrumbs
          navigationPath={nav.currentPath}
          navigateTo={(depth: number) =>
            setNav({ ...nav, currentPath: nav.currentPath.slice(0, depth) })
          }
        />
      </Layout.FixedSection>
      <Layout.GrowingSection>
        <FilterList>
          <FilterList.InputField placeHolderSearchText={t('asset-search-placeholder')} />
          <FilterList.Favorites>
            <Title order={2} mb={'xs'}>
              {t('folder.title')}
            </Title>
            {currentFolder.subFolders.length === 0 && (
              <Text c={'dimmed'}>{t('folder.empty')}</Text>
            )}
            <DynamicGrid spacing={'xs'} verticalSpacing={'xs'} minChildSize={170}>
              {currentFolder.subFolders.map((folder) => (
                <Button
                  key={folder.name}
                  onClick={() =>
                    setNav({ ...nav, currentPath: [...nav.currentPath, folder.name] })
                  }
                  leftSection={<FolderIcon />}
                  h={80}
                >
                  <Text
                    lineClamp={3}
                    style={{ whiteSpace: 'wrap', wordBreak: 'break-all' }}
                  >
                    {folder.name}
                  </Text>
                </Button>
              ))}
            </DynamicGrid>

            <Divider mt={'xs'} />
            <Title order={2} mb={'xs'}>
              {t('assets.title')}
            </Title>
            {currentFolder.assets.length === 0 && (
              <Text c={'dimmed'}>{t('assets.empty')}</Text>
            )}
            <DynamicGrid spacing={'xs'} verticalSpacing={'xs'} minChildSize={170}>
              {currentFolder.assets.map((asset) => (
                <AssetButton
                  key={asset.name}
                  asset={asset}
                  onClick={() => loadAsset(asset)}
                />
              ))}
            </DynamicGrid>
            <Stack my={'xs'} gap={'xs'}></Stack>
          </FilterList.Favorites>

          <FilterList.SearchResults
            data={nestedAssetsInCurrentFolder}
            renderElement={(asset: Asset) => (
              <AssetButton
                key={asset.name}
                asset={asset}
                onClick={() => loadAsset(asset)}
              />
            )}
            matcherFunc={wordInString}
          >
            <FilterList.SearchResults.VirtualGrid gap={'xs'} columns={columns} />
          </FilterList.SearchResults>
        </FilterList>
      </Layout.GrowingSection>
    </Layout>
  );
}
