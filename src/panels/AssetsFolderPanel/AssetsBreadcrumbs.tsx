import { useTranslation } from 'react-i18next';
import { Breadcrumbs, Button } from '@mantine/core';

import { HomeIcon } from '@/icons/icons';

interface Props {
  navigationPath: string[];
  navigateTo: (depth: number) => void;
}

export function AssetsBreadcrumbs({ navigationPath, navigateTo }: Props) {
  const { t } = useTranslation('panel-assets', { keyPrefix: 'breadcrumbs' });

  return (
    <Breadcrumbs separatorMargin={0} separator={'/'} mb={'xs'}>
      <Button
        variant={'subtle'}
        p={2}
        onClick={() => navigateTo(0)}
        aria-label={t('aria-labels.home')}
        size={'compact-sm'}
      >
        <HomeIcon />
      </Button>
      {navigationPath.map((folderName, i) => (
        <Button
          key={`${folderName}_${i}`}
          p={2}
          variant={'subtle'}
          onClick={() => navigateTo(i + 1)}
          aria-label={t('aria-labels.breadcrumb', { path: folderName })}
          size={'compact-sm'}
        >
          {folderName}
        </Button>
      ))}
    </Breadcrumbs>
  );
}
