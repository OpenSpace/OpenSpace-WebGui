import { useTranslation } from 'react-i18next';
import { ActionIcon, Menu, Stack, Text, Tooltip } from '@mantine/core';
import { modals } from '@mantine/modals';

import { useOpenSpaceApi } from '@/api/hooks';
import { CopyToClipboardButton } from '@/components/CopyToClipboardButton/CopyToClipboardButton';
import { OpenFolderIcon, RefreshIcon, VerticalDotsIcon } from '@/icons/icons';
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
  const luaApi = useOpenSpaceApi();

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
    <Menu position={'right-start'} closeOnItemClick={false}>
      <Menu.Target>
        <ActionIcon aria-label={t('more-menu-aria-label')}>
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
              <Menu.Item
                onClick={onReloadAssetModal}
                aria-label={t('reload-button.aria-label', { assetName: asset.name })}
                disabled={parents.length > 0}
                leftSection={<RefreshIcon size={IconSize.xs} />}
              >
                {t('reload-button.label')}
              </Menu.Item>
            </Tooltip>
          )}
          <CopyToClipboardButton
            mode={'menuItem'}
            value={asset.path.replaceAll('\\', '/')}
            copyTooltipLabel={t('copy-tooltip-label')}
            copyLabel={t('copy-tooltip-label')}
            iconPosition={'left'}
            iconSize={IconSize.xs}
          />
          <Menu.Item
            onClick={() => {
              luaApi?.openFileExplorer(asset.path);
            }}
            leftSection={<OpenFolderIcon size={IconSize.xs} />}
          >
            {t('open-file-explorer-label')}
          </Menu.Item>
        </Stack>
      </Menu.Dropdown>
    </Menu>
  );
}
