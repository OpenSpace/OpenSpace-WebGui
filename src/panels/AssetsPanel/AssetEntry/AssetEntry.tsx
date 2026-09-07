import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Group, Text, Tooltip } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { FileTextIcon } from '@/icons/icons';
import { useAppSelector } from '@/redux/hooks';
import { IconSize } from '@/types/enums';

import { Asset } from '../types';

import { AssetEntryMenu } from './AssetEntryMenu';
import { AssetLoadingStateIcon } from './AssetLoadingStateIcon';
import { AssetRemoveButton } from './AssetRemoveButton';

interface Props {
  asset: Asset;
}
export function AssetEntry({ asset }: Props) {
  const { t } = useTranslation('panel-assets', { keyPrefix: 'asset-entry' });

  const states = useAppSelector((state) => state.assetTree.states);
  const assetLoadingState = states[asset.path] ?? 'Unloaded';
  const rootAssets = useAppSelector((state) => state.assetTree.rootAssets);
  const isRootAsset = rootAssets.includes(asset.path);

  const [parents, setParents] = useState<string[]>([]);

  const luaApi = useOpenSpaceApi();

  const fetchParents = useCallback(async () => {
    const requiredBy = await luaApi?.asset.parents(asset.path);
    setParents(Object.values(requiredBy ?? []));
  }, [luaApi, asset.path]);

  // Check if this asset is required by other assets (only valid for root assets)
  useEffect(() => {
    if (!isRootAsset) {
      return;
    }
    // Many assets can transition state in a tight burst (e.g., a root asset loading
    // several children at once), and each transition could mean this asset's parent list
    // changed. Rather than calling `fetchParents` once per transition, wait until the
    // burst settles before making the Lua call
    const handle = setTimeout(() => {
      fetchParents();
    }, 250);

    return () => {
      clearTimeout(handle);
    };
  }, [isRootAsset, states, fetchParents]);

  async function loadAsset() {
    // Do nothing if asset is already loaded or loading
    if (isRootAsset || assetLoadingState === 'Loading') {
      return;
    }
    // If the asset failed to load we try to reload it
    if (assetLoadingState === 'Error') {
      reloadAsset();
      return;
    }

    await luaApi?.asset.add(asset.path);
    fetchParents();
  }

  function reloadAsset() {
    if (assetLoadingState === 'Loading') {
      return;
    }
    luaApi?.asset.reload(asset.path);
  }

  async function removeAsset() {
    if (assetLoadingState === 'Unloaded') {
      return;
    }
    await luaApi?.asset.remove(asset.path);
  }

  return (
    <Group gap={0}>
      <Tooltip label={asset.path} position={'top-start'}>
        <Button
          leftSection={<FileTextIcon size={IconSize.sm} />}
          onClick={loadAsset}
          variant={'subtle'}
          justify={'left'}
          size={'compact-sm'}
          mb={3}
          flex={1}
          aria-label={t('aria-labels.add', { assetName: asset.name })}
        >
          <Text truncate>{asset.name}</Text>
        </Button>
      </Tooltip>
      {isRootAsset && (
        <AssetRemoveButton asset={asset} parents={parents} onRemoveAsset={removeAsset} />
      )}
      <AssetLoadingStateIcon loadState={assetLoadingState} asset={asset} />
      <AssetEntryMenu
        asset={asset}
        parents={parents}
        showReloadButton={isRootAsset}
        reloadAsset={reloadAsset}
      />
    </Group>
  );
}
