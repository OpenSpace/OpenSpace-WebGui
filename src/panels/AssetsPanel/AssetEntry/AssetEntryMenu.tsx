import { useTranslation } from 'react-i18next';
import { ActionIcon, Menu, Text } from '@mantine/core';
import { modals } from '@mantine/modals';

import { useOpenSpaceApi } from '@/api/hooks';
import { ConfirmModalContent } from '@/components/ConfirmModalContent/ConfirmModalContent';
import { CopyToClipboardButton } from '@/components/CopyToClipboardButton/CopyToClipboardButton';
import { MaybeTooltip } from '@/components/MaybeTooltip/MaybeTooltip';
import { OpenFolderIcon, RefreshIcon, VerticalDotsIcon } from '@/icons/icons';
import { IconSize } from '@/types/enums';

import { Asset } from '../types';
import { normalizePath } from '../util';

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
        <ConfirmModalContent
          description={t('reload-assset-modal.description')}
          objectName={asset.name}
        />
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
        <ActionIcon size={'sm'} aria-label={t('more-menu-aria-label')}>
          <VerticalDotsIcon />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <>
          {showReloadButton && (
            <MaybeTooltip
              showTooltip={parents.length > 0}
              label={
                <>
                  <Text size={'sm'} pb={'xs'}>
                    {t('reload-button.tooltip')}
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
                leftSection={<RefreshIcon size={IconSize.xs} />}
              >
                {t('reload-button.label')}
              </Menu.Item>
            </MaybeTooltip>
          )}
          <CopyToClipboardButton
            mode={'menuItem'}
            value={async () => {
              // Resolve the tokenized path to an absolute path before copying
              const absolutePath = (await luaApi?.absPath(asset.path)) ?? asset.path;
              return normalizePath(absolutePath);
            }}
            copyTooltipLabel={t('copy-tooltip-label')}
            copyLabel={t('copy-tooltip-label')}
            iconPosition={'left'}
            iconSize={IconSize.xs}
          />
          <Menu.Item
            onClick={async () => {
              if (!luaApi) {
                return;
              }
              // Resolve the tokenized path to an absolute path before opening the explorer
              const absolutePath = await luaApi.absPath(asset.path);
              luaApi.openFileExplorer(absolutePath);
            }}
            leftSection={<OpenFolderIcon size={IconSize.xs} />}
            disabled={!luaApi}
          >
            {t('open-file-explorer-label')}
          </Menu.Item>
        </>
      </Menu.Dropdown>
    </Menu>
  );
}
