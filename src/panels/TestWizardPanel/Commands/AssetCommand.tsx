import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Select, Stack, TextInput } from '@mantine/core';

import { Layout } from '@/components/Layout/Layout';
import { useSubscribeToAssetTree } from '@/hooks/topicSubscriptions';
import { useAppSelector } from '@/redux/hooks';

import { SaveCancelButtons } from '../SaveCancelButtons';
import { TestCommand } from '../types';

interface Props {
  onAdd: (command: TestCommand) => void;
  onCancel: () => void;
}

export function AssetCommand({ onAdd, onCancel }: Props) {
  const { t } = useTranslation('panel-testwizard', { keyPrefix: 'add-command-form' });
  const [asset, setAsset] = useState('');
  const states = useAppSelector((state) => state.assetTree.states);
  useSubscribeToAssetTree();

  const assetOptions = useMemo(
    () =>
      Object.entries(states)
        .filter(([, state]) => state === 'Loaded')
        .map(([path]) => path)
        .sort(),
    [states]
  );

  return (
    <>
      <Layout.GrowingSection>
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
        </Stack>
      </Layout.GrowingSection>
      <Layout.FixedSection>
        <SaveCancelButtons
          onSave={() => onAdd({ type: 'asset', value: asset })}
          onCancel={onCancel}
          saveLabel={'add'}
          saveDisabled={!asset}
        />
      </Layout.FixedSection>
    </>
  );
}
