import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActionIcon,
  Button,
  CheckIcon,
  Group,
  Loader,
  Stack,
  Text,
  ThemeIcon,
  Tooltip
} from '@mantine/core';
import { modals } from '@mantine/modals';

import { useOpenSpaceApi } from '@/api/hooks';
import { WarningIcon } from '@/components/WarningIcon/WarningIcon';
import { DeleteIcon, FileTextIcon } from '@/icons/icons';
import { AssetLoadingEvent } from '@/redux/events/types';
import { IconSize } from '@/types/enums';
import { eventBus } from '@/util/eventBus';

import { AssetEntryMenu } from './AssetEntryMenu';
import { Asset, AssetLoadState } from './types';

interface Props {
  asset: Asset;
}

export function AssetsEntry({ asset }: Props) {
  const [loadState, setLoadState] = useState<AssetLoadState>(AssetLoadState.NotLoaded);
  const [isRootAsset, setIsRootAsset] = useState<boolean>(false);
  const [parents, setParents] = useState<string[]>([]);

  const luaApi = useOpenSpaceApi();
  const { t } = useTranslation('panel-assets', { keyPrefix: 'asset-entry' });

  const fetchParents = useCallback(async () => {
    const requiredBy = await luaApi?.asset.parents(asset.path);
    setParents(Object.values(requiredBy ?? []));
  }, [luaApi, asset.path]);

  // Get the initial load state of this asset
  useEffect(() => {
    async function initialLoadedState() {
      const loaded = await luaApi?.asset.isLoaded(asset.path);
      const newState = loaded ? AssetLoadState.Loaded : AssetLoadState.NotLoaded;
      setLoadState(newState);
      return loaded;
    }

    initialLoadedState();
  }, [luaApi, asset.path]);

  // Check if this asset is a root asset
  useEffect(() => {
    async function checkIsRootAsset() {
      const assets = await luaApi?.asset.rootAssets();
      if (!assets) {
        return;
      }
      const rootAssets = Object.values(assets).map((path) => path.replaceAll('\\', '/'));
      const isRoot = rootAssets.includes(asset.path.replaceAll('\\', '/'));
      if (isRoot) {
        fetchParents();
      }
      setIsRootAsset(isRoot);
    }

    if (loadState === AssetLoadState.Loaded || loadState === AssetLoadState.Error) {
      checkIsRootAsset();
    }
  }, [luaApi, loadState, asset.path, fetchParents]);

  // Subscribe to AssetLoading event, handle callback
  useEffect(() => {
    async function onAssetLoadingEvent(data: AssetLoadingEvent) {
      if (data.AssetPath.replaceAll('\\', '/') === asset.path.replaceAll('\\', '/')) {
        switch (data.State) {
          case 'Loaded':
            setLoadState(AssetLoadState.Loaded);
            break;
          case 'Loading':
            setLoadState(AssetLoadState.Loading);
            break;
          case 'Unloaded':
            setLoadState(AssetLoadState.NotLoaded);
            break;
          case 'Error':
            setLoadState(AssetLoadState.Error);
            break;
          default:
            throw new Error(`Unhandled Asset load state: '${data.State}'`);
        }
      } else {
        // Some other asset was loaded, we must recheck if this asset is required by the
        // newly added assets
        if (isRootAsset) {
          fetchParents();
        }
      }
    }

    eventBus.subscribe('AssetLoading', onAssetLoadingEvent);

    return () => {
      eventBus.unsubscribe('AssetLoading', onAssetLoadingEvent);
    };
  }, [luaApi, loadState, isRootAsset, asset.path, fetchParents]);

  async function loadAsset() {
    // Do nothing if asset is already loaded or loading
    if (isRootAsset || loadState === AssetLoadState.Loading) {
      return;
    }
    // If the asset failed to load we try to reload it
    if (loadState === AssetLoadState.Error) {
      reloadAsset();
    } else {
      // If this asset was already loaded by something else and we try to add it again
      // i.e., add it as a root asset. OpenSpace will not actually call any load or
      // initialize on this asset so we will never recieve the callbacks. Hence we
      // manually mark it as a root asset.
      if (loadState === AssetLoadState.Loaded) {
        setIsRootAsset(true);
      } else {
        setLoadState(AssetLoadState.Loading);
      }
      luaApi?.asset.add(asset.path);
      fetchParents();
    }
  }

  async function reloadAsset() {
    if (loadState === AssetLoadState.Loading) {
      return;
    }
    luaApi?.asset.reload(asset.path);
    setLoadState(AssetLoadState.Loading);
  }

  async function removeAsset() {
    if (loadState === AssetLoadState.NotLoaded) {
      return;
    }
    await luaApi?.asset.remove(asset.path);
    if (loadState === AssetLoadState.Error) {
      // If the asset is in an error state the onDenitialize function is not called in the
      // engine. That means that the callback 'AssetUnloadingFinished' is not called
      // either. @TODO (anden88 2025-11-14): I don't believe that another asset can be
      // dependent on this broken asset, so we *should* be able to mark it as unloaded.
      // For now we make another manual check to see wether it is still loaded or not.
      const isKeptAlive = await luaApi?.asset.isLoaded(asset.path);
      if (isKeptAlive) {
        setLoadState(AssetLoadState.Loaded);
      } else {
        setLoadState(AssetLoadState.NotLoaded);
      }
    }
    setIsRootAsset(false);
  }

  function onRemoveAssetModal() {
    modals.openConfirmModal({
      title: 'Remove Asset',
      children: (
        <Stack>
          <Text>Are you sure you want to remove the asset:</Text>
          <Text>{asset.name}</Text>
          <Text style={{ wordBreak: 'break-all' }}>{asset.path}</Text>
        </Stack>
      ),
      labels: {
        confirm: 'Remove',
        cancel: 'Cancel'
      },
      confirmProps: { color: 'red', variant: 'filled' },
      onConfirm: removeAsset
    });
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
        <Tooltip
          label={
            parents.length > 0 ? (
              <>
                <Text>
                  This asset is required by additional assets, removing it will have no
                  effect until the following assets are removed:
                </Text>
                {parents.map((parent) => (
                  <Text key={parent} size={'xs'} style={{ wordBreak: 'break-all' }}>
                    {parent}
                  </Text>
                ))}
              </>
            ) : (
              <Text>Remove Asset</Text>
            )
          }
        >
          <ActionIcon
            onClick={onRemoveAssetModal}
            variant={'subtle'}
            color={'red'}
            aria-label={t('aria-labels.remove', { assetName: asset.name })}
            disabled={parents.length > 0}
          >
            <DeleteIcon />
          </ActionIcon>
        </Tooltip>
      )}
      {loadState === AssetLoadState.Loading && <Loader size={'xs'} />}
      {loadState === AssetLoadState.Loaded && (
        <Tooltip label={'Asset is loaded'}>
          <ThemeIcon
            color={'teal'}
            variant={'subtle'}
            aria-label={t('aria-labels.added', { assetName: asset.name })}
          >
            <CheckIcon size={IconSize.xs} />
          </ThemeIcon>
        </Tooltip>
      )}
      {loadState === AssetLoadState.Error && (
        <WarningIcon tooltipText={'Asset failed to load'} />
      )}

      <AssetEntryMenu
        asset={asset}
        parents={parents}
        showReloadButton={isRootAsset}
        reloadAsset={reloadAsset}
      />
    </Group>
  );
}
