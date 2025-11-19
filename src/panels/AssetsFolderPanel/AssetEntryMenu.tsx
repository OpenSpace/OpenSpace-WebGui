import { useTranslation } from 'react-i18next';
import { MdOutlineRefresh } from 'react-icons/md';
import { ActionIcon, Button, Menu, Stack, Text, Tooltip } from '@mantine/core';
import { modals } from '@mantine/modals';

import { CopyToClipboardButton } from '@/components/CopyToClipboardButton/CopyToClipboardButton';
import { VerticalDotsIcon } from '@/icons/icons';
import { IconSize } from '@/types/enums';

import { Asset } from './types';

interface Props {
  asset: Asset;
  parents: string[];
  showReloadButton: boolean;
  reloadAsset: () => void;
}

export function AssetEntryMenu({ asset, parents, showReloadButton, reloadAsset }: Props) {
  const { t } = useTranslation('panel-assets', { keyPrefix: 'asset-entry' });

  function onReloadAssetModal() {
    modals.openConfirmModal({
      title: 'Reload Asset',
      children: (
        <Stack>
          <Text>Are you sure you want to reload the asset:</Text>
          <Text>{asset.name}</Text>
          <Text style={{ wordBreak: 'break-all' }}>{asset.path}</Text>
        </Stack>
      ),
      labels: {
        confirm: 'Reload',
        cancel: 'Cancel'
      },
      confirmProps: { color: 'orange', variant: 'filled' },
      onConfirm: reloadAsset
    });
  }

  return (
    <Menu position={'right-start'}>
      <Menu.Target>
        <ActionIcon>
          <VerticalDotsIcon />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <Stack gap={'xs'}>
          {showReloadButton && (
            <Tooltip
              label={
                parents.length > 0 ? (
                  <>
                    <Text>
                      Cannot reload an asset required by other assets. The following
                      assets must first be removed:
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
              <Button
                onClick={onReloadAssetModal}
                aria-label={t('aria-labels.reload', { assetName: asset.name })}
                disabled={parents.length > 0}
                leftSection={<MdOutlineRefresh size={IconSize.sm} />}
              >
                Reload
              </Button>
            </Tooltip>
          )}
          <CopyToClipboardButton
            value={asset.path.replaceAll('\\', '/')}
            copyTooltipLabel={t('copy-tooltip-label')}
            showLabel
            copyLabel={t('copy-tooltip-label')}
          />
        </Stack>
      </Menu.Dropdown>
    </Menu>
  );
}
