import { useTranslation } from 'react-i18next';
import { MdOutlineRefresh } from 'react-icons/md';
import { ActionIcon, Menu, Stack, Text } from '@mantine/core';
import { modals } from '@mantine/modals';

import { CopyToClipboardButton } from '@/components/CopyToClipboardButton/CopyToClipboardButton';
import { MaybeTooltip } from '@/components/MaybeTooltip/MaybeTooltip';
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
    <Menu position={'left-start'}>
      <Menu.Target>
        <ActionIcon aria-label={t('more-menu-aria-label')}>
          <VerticalDotsIcon />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        {showReloadButton && (
          <>
            <MaybeTooltip
              showTooltip={parents.length > 0}
              label={
                <>
                  <Text size={'sm'} pb={'xs'}>
                    {t('reload-button.tooltip.has-parents')}
                  </Text>
                  {parents.map((parent) => (
                    <Text key={parent} size={'xs'} style={{ wordBreak: 'break-all' }}>
                      {parent}
                    </Text>
                  ))}
                </>
              }
            >
              <Menu.Item
                onClick={onReloadAssetModal}
                aria-label={t('reload-button.aria-label', { assetName: asset.name })}
                disabled={parents.length > 0}
                leftSection={<MdOutlineRefresh size={IconSize.sm} />}
              >
                {t('reload-button.label')}
              </Menu.Item>
            </MaybeTooltip>
            <Menu.Divider />
          </>
        )}
        <CopyToClipboardButton
          value={asset.path.replaceAll('\\', '/')}
          copyTooltipLabel={t('copy-tooltip-label')}
          showLabel
          copyLabel={t('copy-tooltip-label')}
        />
      </Menu.Dropdown>
    </Menu>
  );
}
