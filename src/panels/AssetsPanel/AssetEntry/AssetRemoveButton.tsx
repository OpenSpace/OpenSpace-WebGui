import { useTranslation } from 'react-i18next';
import { ActionIcon, Text, Tooltip } from '@mantine/core';
import { modals } from '@mantine/modals';

import { ConfirmModalContent } from '@/components/ConfirmModalContent/ConfirmModalContent';
import { DeleteIcon } from '@/icons/icons';

import { Asset } from '../types';

interface Props {
  asset: Asset;
  parents: string[];
  onRemoveAsset: () => void;
}

export function AssetRemoveButton({ asset, parents, onRemoveAsset }: Props) {
  const { t } = useTranslation('panel-assets', { keyPrefix: 'asset-entry' });

  function onRemoveAssetModal() {
    modals.openConfirmModal({
      title: t('remove-asset-modal.title'),
      children: (
        <ConfirmModalContent
          objectName={asset.name}
          description={t('remove-asset-modal.description')}
          extraContent={<Text style={{ wordBreak: 'break-all' }}>{asset.path}</Text>}
        />
      ),
      labels: {
        confirm: t('remove-asset-modal.confirm'),
        cancel: t('remove-asset-modal.cancel')
      },
      confirmProps: { color: 'red', variant: 'filled' },
      onConfirm: onRemoveAsset
    });
  }

  return (
    <Tooltip
      label={
        parents.length > 0 ? (
          <>
            <Text>{t('tooltips.remove.has-parents')}</Text>
            {parents.map((parent) => (
              <Text key={parent} size={'xs'} style={{ wordBreak: 'break-all' }}>
                {parent}
              </Text>
            ))}
          </>
        ) : (
          <Text>{t('tooltips.remove.no-parents')}</Text>
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
  );
}
