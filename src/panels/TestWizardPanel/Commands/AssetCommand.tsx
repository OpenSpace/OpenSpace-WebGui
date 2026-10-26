import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Select, Stack, TextInput } from '@mantine/core';

import { useSubscribeToAssetTree } from '@/hooks/topicSubscriptions';
import { useRootPaths } from '@/panels/AssetsPanel/hooks';
import { useAppSelector } from '@/redux/hooks';

import { SaveCancelButtons } from '../SaveCancelButtons';
import { TestCommand } from '../types';
import { assetNameFromPath } from '../util';

interface Props {
  onAdd: (command: TestCommand) => void;
  onCancel: () => void;
}

export function AssetCommand({ onAdd, onCancel }: Props) {
  const { t } = useTranslation('panel-testwizard', { keyPrefix: 'add-command-form' });

  const rootAssets = useAppSelector((state) => state.assetTree.rootAssets);

  const [asset, setAsset] = useState('');

  const assetRoots = useRootPaths();
  useSubscribeToAssetTree();

  const assetOptions = useMemo(
    () =>
      assetRoots
        ? rootAssets
            .map((assetPath) => assetNameFromPath(assetPath, assetRoots.data))
            .sort()
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
          onChange={(value) => {
            if (value) {
              setAsset(value);
            }
          }}
          searchable
        />
      ) : (
        <TextInput
          label={t('asset.path-label')}
          placeholder={t('asset.path-placeholder')}
          value={asset}
          onChange={(event) => setAsset(event.currentTarget.value)}
        />
      )}
      <SaveCancelButtons
        onSave={() => onAdd({ type: 'asset', value: asset })}
        onCancel={onCancel}
        saveLabel={'add'}
        saveDisabled={!asset}
      />
    </Stack>
  );
}
