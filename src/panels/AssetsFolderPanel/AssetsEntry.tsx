import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdOutlineRefresh } from 'react-icons/md';
import {
  ActionIcon,
  Button,
  CheckIcon,
  Group,
  Loader,
  Text,
  ThemeIcon,
  Tooltip
} from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { CopyToClipboardButton } from '@/components/CopyToClipboardButton/CopyToClipboardButton';
import { DeleteIcon, FileTextIcon } from '@/icons/icons';
import {
  AssetLoadingErrorEvent,
  AssetLoadingFinishedEvent,
  AssetUnloadingFinishedEvent
} from '@/redux/events/types';
import { IconSize } from '@/types/enums';
import { eventBus } from '@/util/eventBus';

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

  const fetchInterestedParents = useCallback(async () => {
    const requiredBy = await luaApi?.asset.interestedParents(asset.path);
    setParents(Object.values(requiredBy));
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
        fetchInterestedParents();
      }
      setIsRootAsset(isRoot);
    }

    if (loadState === AssetLoadState.Loaded || loadState === AssetLoadState.Error) {
      checkIsRootAsset();
    }
  }, [luaApi, loadState, asset.path, fetchInterestedParents]);

  // Subscribe to AssetLoadingFinished event, handle callback
  useEffect(() => {
    async function onAssetLoadedEvent(data: AssetLoadingFinishedEvent) {
      if (data.AssetPath.replaceAll('\\', '/') === asset.path.replaceAll('\\', '/')) {
        setLoadState(AssetLoadState.Loaded);
      } else {
        // Some other asset was loaded, we must recheck if this asset is required by the
        // newly added assets
        if (isRootAsset) {
          fetchInterestedParents();
        }
      }
    }

    eventBus.subscribe('AssetLoadingFinished', onAssetLoadedEvent);

    return () => {
      eventBus.unsubscribe('AssetLoadingFinished', onAssetLoadedEvent);
    };
  }, [luaApi, loadState, isRootAsset, asset.path, fetchInterestedParents]);

  // Subscribe to AssestLoadingError event, handle callback
  useEffect(() => {
    function onAssetErrorEvent(data: AssetLoadingErrorEvent) {
      if (data.AssetPath.replaceAll('\\', '/') === asset.path.replaceAll('\\', '/')) {
        setLoadState(AssetLoadState.Error);
      } else {
        // Some other asset was loaded, we must recheck if this asset is required by the
        // newly added assets
        if (isRootAsset) {
          fetchInterestedParents();
        }
      }
    }

    eventBus.subscribe('AssetLoadingError', onAssetErrorEvent);

    return () => {
      eventBus.unsubscribe('AssetLoadingError', onAssetErrorEvent);
    };
  }, [isRootAsset, asset.path, fetchInterestedParents]);

  // Subscribe to AssetUnloadingFinished event, handle callback
  useEffect(() => {
    function onAssetUnloadedEvent(data: AssetUnloadingFinishedEvent) {
      if (data.AssetPath.replaceAll('\\', '/') === asset.path.replaceAll('\\', '/')) {
        setLoadState(AssetLoadState.NotLoaded);
      } else {
        // Some other asset was unloaded, we must recheck if this asset is still required
        // by any assets
        if (isRootAsset) {
          fetchInterestedParents();
        }
      }
    }

    eventBus.subscribe('AssetUnloadingFinished', onAssetUnloadedEvent);

    return () => {
      eventBus.unsubscribe('AssetUnloadingFinished', onAssetUnloadedEvent);
    };
  }, [isRootAsset, asset.path, fetchInterestedParents]);

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
      fetchInterestedParents();
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

      {(loadState === AssetLoadState.Error || isRootAsset) && (
        <Tooltip
          label={
            parents.length > 0 ? (
              <>
                <Text>
                  Cannot reload an asset required by other assets. The following assets
                  must first be removed:
                </Text>
                {parents.map((parent) => (
                  <Text key={parent} size={'xs'} style={{ wordBreak: 'break-all' }}>
                    {parent}
                  </Text>
                ))}
              </>
            ) : (
              <Text>Reload asset</Text>
            )
          }
        >
          <ActionIcon
            onClick={reloadAsset}
            color={loadState === AssetLoadState.Error ? 'red' : 'orange'}
            variant={'subtle'}
            aria-label={t('aria-labels.reload', { assetName: asset.name })}
            disabled={parents.length > 0}
          >
            <MdOutlineRefresh size={IconSize.sm} />
          </ActionIcon>
        </Tooltip>
      )}
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
            onClick={removeAsset}
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
      <CopyToClipboardButton
        value={asset.path.replaceAll('\\', '/')}
        copyTooltipLabel={t('copy-tooltip-label')}
      />
    </Group>
  );
}
