import { useEffect, useRef, useState } from 'react';
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
import { AssetLoadingErrorEvent } from '@/redux/events/types';
import { IconSize } from '@/types/enums';
import { eventBus } from '@/util/eventBus';

import { Asset, AssetLoadState } from './types';

interface Props {
  asset: Asset;
}

// TODO AssetUnloadingFinished for example load base and base_keybindings if base is removed
// and then base_keybindings is removed as well. Only keybindings asset will update its status.
// if we have an event we can listen on the other assets that were required by the removed asset
// to also remove them

export function AssetsEntry({ asset }: Props) {
  const [loadState, setLoadState] = useState<AssetLoadState>(AssetLoadState.NotLoaded);
  const [isRootAsset, setIsRootAsset] = useState<boolean>(false);
  // const [loading, setLoading] = useState<boolean>(false);
  const luaApi = useOpenSpaceApi();
  const { t } = useTranslation('panel-assets', { keyPrefix: 'asset-entry' });

  // This ref is required due to the order of the AssetLoadingFinished and
  // AssetLoadingError events are sent. We end up with a stale state in the event
  // handlers without it.
  // TODO (anden88, 2025-11-07): I tried to update the ref in a useEffect with loadState
  // as dependency. However, the stale state issue persisted, hence the manual assignments.
  const loadStateRef = useRef(loadState);

  // Get the initial load state of this asset
  useEffect(() => {
    async function initialLoadedState() {
      const loaded = await luaApi?.asset.isLoaded(asset.path);
      const newState = loaded ? AssetLoadState.Loaded : AssetLoadState.NotLoaded;
      setLoadState(newState);
      loadStateRef.current = newState;
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
      setIsRootAsset(isRoot);
    }

    if (loadState === AssetLoadState.Loaded || loadState === AssetLoadState.Error) {
      checkIsRootAsset();
    }
  }, [luaApi, loadState, asset.path]);

  // Subscribe to AssetLoadingFinished event, handle callback
  useEffect(() => {
    async function onAssetLoadedEvent() {
      // An AssetLoadingFinished event is sent from the engine even if the asset fails to
      // load. Therefore we need this ref to get the latest load state to avoid stale
      // states in the registered callback handler.
      if (loadStateRef.current === AssetLoadState.Error) {
        return;
      }

      const isNowLoaded = await luaApi?.asset.isLoaded(asset.path);
      // Only need to update state if we finished loading this asset
      if (isNowLoaded) {
        setLoadState(AssetLoadState.Loaded);
        eventBus.unsubscribe('AssetLoadingFinished', onAssetLoadedEvent);
      }
    }

    eventBus.subscribe('AssetLoadingFinished', onAssetLoadedEvent);

    return () => {
      eventBus.unsubscribe('AssetLoadingFinished', onAssetLoadedEvent);
    };
  }, [luaApi, loadState, asset.path]);

  // Subscribe to AssestLoadingError event, handle callback
  useEffect(() => {
    function onAssetErrorEvent(data: AssetLoadingErrorEvent) {
      if (data.AssetPath.replaceAll('\\', '/') === asset.path.replaceAll('\\', '/')) {
        setLoadState(AssetLoadState.Error);
        loadStateRef.current = AssetLoadState.Error;
      }
    }

    eventBus.subscribe('AssetLoadingError', onAssetErrorEvent);

    return () => {
      eventBus.unsubscribe('AssetLoadingError', onAssetErrorEvent);
    };
  }, [asset.path]);

  async function loadAsset() {
    // Do nothing if asset is already loaded or loading
    if (isRootAsset || loadState === AssetLoadState.Loading) {
      return;
    }
    // If the asset failed to load we try to reload it
    if (loadState === AssetLoadState.Error) {
      await luaApi?.asset.remove(asset.path);
    }
    setLoadState(AssetLoadState.Loading);
    loadStateRef.current = AssetLoadState.Loading;
    luaApi?.asset.add(asset.path);
  }

  async function reloadAsset() {
    if (loadState === AssetLoadState.Loading) {
      return;
    }
    luaApi?.asset.reload(asset.path);
    setLoadState(AssetLoadState.Loading);
    loadStateRef.current = AssetLoadState.Loading;
  }

  async function removeAsset() {
    if (loadState === AssetLoadState.NotLoaded) {
      return;
    }
    await luaApi?.asset.remove(asset.path);
    const isKeptAlive = await luaApi?.asset.isLoaded(asset.path);
    if (isKeptAlive) {
      setLoadState(AssetLoadState.Loaded); // TODO: asset might be kept alive by another asset
      loadStateRef.current = AssetLoadState.Loaded;
    } else {
      setLoadState(AssetLoadState.NotLoaded); // TODO: asset might be kept alive by another asset
      loadStateRef.current = AssetLoadState.NotLoaded;
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
        <ActionIcon
          onClick={reloadAsset}
          color={loadState === AssetLoadState.Error ? 'red' : 'orange'}
          variant={'subtle'}
          aria-label={t('aria-labels.reload', { assetName: asset.name })}
        >
          <MdOutlineRefresh size={IconSize.sm} />
        </ActionIcon>
      )}
      {isRootAsset && (
        <ActionIcon
          onClick={removeAsset}
          variant={'subtle'}
          color={'red'}
          aria-label={t('aria-labels.remove', { assetName: asset.name })}
        >
          <DeleteIcon />
        </ActionIcon>
      )}
      {loadState === AssetLoadState.Loading && <Loader size={'xs'} />}
      {loadState === AssetLoadState.Loaded && (
        <ThemeIcon
          color={'teal'}
          variant={'subtle'}
          aria-label={t('aria-labels.added', { assetName: asset.name })}
        >
          <CheckIcon size={IconSize.xs} />
        </ThemeIcon>
      )}
      <CopyToClipboardButton
        value={asset.path.replaceAll('\\', '/')}
        copyTooltipLabel={t('copy-tooltip-label')}
      />
    </Group>
  );
}
