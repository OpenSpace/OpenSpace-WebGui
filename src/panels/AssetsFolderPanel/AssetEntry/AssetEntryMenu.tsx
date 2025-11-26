import { useTranslation } from 'react-i18next';
import { MdOutlineRefresh } from 'react-icons/md';
import { ActionIcon, Button, Menu, Stack, Text, Tooltip } from '@mantine/core';
import { modals } from '@mantine/modals';

import { CopyToClipboardButton } from '@/components/CopyToClipboardButton/CopyToClipboardButton';
import { VerticalDotsIcon } from '@/icons/icons';
import { IconSize } from '@/types/enums';

import { Asset } from '../types';

interface Props {
  asset: Asset;
  parents: string[];
  showReloadButton: boolean;
  reloadAsset: () => void;
}

export function AssetEntryMenu({ asset, parents, showReloadButton, reloadAsset }: Props) {
  const { t } = useTranslation('panel-assets', { keyPrefix: 'asset-entry-menu' });

  function onReloadAssetModal() {
    modals.openConfirmModal({
      title: t('reload-assset-modal.title'),
      children: (
        <Stack>
          <Text>{t('reload-assset-modal.description')}</Text>
          <Text fw={500} size={'lg'}>
            {asset.name}
          </Text>
        </Stack>
      ),
      labels: {
        confirm: t('reload-assset-modal.confirm'),
        cancel: t('reload-assset-modal.cancel')
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
                    <Text>{t('reload-button.tooltip.has-parents')}</Text>
                    {parents.map((parent) => (
                      <Text key={parent} size={'xs'} style={{ wordBreak: 'break-all' }}>
                        {parent}
                      </Text>
                    ))}
                  </>
                ) : (
                  <Text>{t('reload-button.tooltip.no-parents')}</Text>
                )
              }
            >
              <Button
                onClick={onReloadAssetModal}
                aria-label={t('reload-button.aria-label', { assetName: asset.name })}
                disabled={parents.length > 0}
                leftSection={<MdOutlineRefresh size={IconSize.sm} />}
              >
                {t('reload-button.label')}
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
