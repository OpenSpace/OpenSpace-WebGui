import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Select, Stack, TextInput } from '@mantine/core';

import { Layout } from '@/components/Layout/Layout';
import { useSubscribeToAssetTree } from '@/hooks/topicSubscriptions';
import { useAppSelector } from '@/redux/hooks';

import { SaveCancelButtons } from '../SaveCancelButtons';
import { TestCommand } from '../types';

interface Props {
  onSubmit: (command: TestCommand) => void;
  onCancel: () => void;
  initialValue?: string;
}

export function AssetCommand({ onSubmit, onCancel, initialValue }: Props) {
  const { t } = useTranslation('panel-testwizard', { keyPrefix: 'command-form' });
  const [asset, setAsset] = useState(initialValue ?? '');
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
          onSave={() => onSubmit({ type: 'asset', value: asset })}
          onCancel={onCancel}
          saveLabel={initialValue === undefined ? 'add' : 'save'}
          saveDisabled={!asset}
        />
      </Layout.FixedSection>
    </>
  );
}
