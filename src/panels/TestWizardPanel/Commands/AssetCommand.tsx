import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Select, Stack, TextInput } from '@mantine/core';

import { useSubscribeToAssetTree } from '@/hooks/topicSubscriptions';
import { useRootPaths } from '@/panels/AssetsPanel/hooks';
import { useAppSelector } from '@/redux/hooks';

import { TestCommand } from '../types';
import { assetNameFromPath } from '../util';

import { AddCommandButton } from './AddCommandButton';

interface Props {
  onAdd: (command: TestCommand) => void;
}

export function AssetCommand({ onAdd }: Props) {
  const { t } = useTranslation('panel-testwizard', { keyPrefix: 'add-command-form' });

  const rootAssets = useAppSelector((state) => state.assetTree.rootAssets);

  const [asset, setAsset] = useState('');

  const assetRoots = useRootPaths();
  useSubscribeToAssetTree();

  const assetOptions = useMemo(
    () =>
      assetRoots
        ? rootAssets.map((a) => assetNameFromPath(a, assetRoots.data)).sort()
        : [],
    [rootAssets, assetRoots]
  );

  return (
    <Stack gap={'sm'}>
      {assetOptions.length > 0 ? (
        <Select
          label={t('asset.select-label')}
          data={assetOptions}
          value={asset}
          onChange={(v) => {
            if (v) {
              setAsset(v);
            }
          }}
          searchable
        />
      ) : (
        <TextInput
          label={t('asset.path-label')}
          placeholder={t('asset.path-placeholder')}
          value={asset}
          onChange={(e) => setAsset(e.currentTarget.value)}
        />
      )}
      <AddCommandButton
        onClick={() => onAdd({ type: 'asset', value: asset })}
        disabled={!asset}
      />
    </Stack>
  );
}
