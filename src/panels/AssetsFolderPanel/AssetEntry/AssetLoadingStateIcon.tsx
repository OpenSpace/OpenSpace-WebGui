import { useTranslation } from 'react-i18next';
import { CheckIcon, Loader, ThemeIcon, Tooltip } from '@mantine/core';

import { WarningIcon } from '@/components/WarningIcon/WarningIcon';
import { IconSize } from '@/types/enums';

import { Asset, AssetLoadState } from '../types';

interface Props {
  loadState: AssetLoadState;
  asset: Asset;
}

export function AssetLoadingStateIcon({ loadState, asset }: Props) {
  const { t } = useTranslation('panel-assets', { keyPrefix: 'asset-entry' });

  switch (loadState) {
    case AssetLoadState.Loading:
      return <Loader size={'xs'} mr={5} />;
    case AssetLoadState.Loaded:
      return (
        <Tooltip label={t('tooltips.added')}>
          <ThemeIcon
            color={'teal'}
            variant={'subtle'}
            aria-label={t('aria-labels.added', { assetName: asset.name })}
          >
            <CheckIcon size={IconSize.xs} />
          </ThemeIcon>
        </Tooltip>
      );
    case AssetLoadState.Error:
      return <WarningIcon tooltipText={t('tooltips.error')} />;
    default:
      return <></>;
  }
}
