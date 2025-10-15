import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, CheckIcon, Group, Loader, ThemeIcon } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { CopyToClipboardButton } from '@/components/CopyToClipboardButton/CopyToClipboardButton';
import { TruncatedText } from '@/components/TruncatedText/TruncatedText';
import { FileTextIcon } from '@/icons/icons';
import { IconSize } from '@/types/enums';
import { eventBus } from '@/util/eventBus';

import { Asset } from './types';

interface Props {
  asset: Asset;
}

export function AssetsEntry({ asset }: Props) {
  const luaApi = useOpenSpaceApi();
  const [loaded, setLoaded] = useState<boolean | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const { t } = useTranslation('panel-assets', { keyPrefix: 'asset-entry' });

  useEffect(() => {
    async function handleAssetEvent() {
      const isNowLoaded = await luaApi?.asset.isLoaded(asset.path);
      // Only need to update state if we finished loading this asset
      if (isNowLoaded) {
        setLoading(false);
        setLoaded(true);
        eventBus.off('AssetLoadingFinished', handleAssetEvent);
      }
    }

    async function initialLoadedState() {
      setLoaded(await luaApi?.asset.isLoaded(asset.path));
    }

    initialLoadedState();
    eventBus.on('AssetLoadingFinished', handleAssetEvent);

    return () => {
      eventBus.off('AssetLoadingFinished', handleAssetEvent);
    };
  }, [luaApi, asset.path]);

  function loadAsset() {
    if (loaded || loading) {
      return;
    }
    setLoading(true);
    luaApi?.asset.add(asset.path);
  }

  return (
    <Group gap={'xs'}>
      <Button
        leftSection={<FileTextIcon size={IconSize.xs} />}
        onClick={loadAsset}
        variant={'subtle'}
        justify={'left'}
        size={'compact-sm'}
        mb={3}
        flex={1}
      >
        <TruncatedText>{asset.name}</TruncatedText>
      </Button>
      {loading && <Loader size={'xs'} />}
      {loaded && (
        <ThemeIcon color={'teal'} variant={'subtle'}>
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
