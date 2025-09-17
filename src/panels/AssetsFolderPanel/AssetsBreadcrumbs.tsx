import { useTranslation } from 'react-i18next';
import { ActionIcon, Breadcrumbs, Button, Group } from '@mantine/core';

import { HomeIcon, UpArrowIcon } from '@/icons/icons';

interface Props {
  navigationPath: string[];
  navigateTo: (depth: number) => void;
}
export function AssetsBreadcrumbs({ navigationPath, navigateTo }: Props) {
  const { t } = useTranslation('panel-assets', { keyPrefix: 'breadcrumbs' });

  return (
    <Group mb={'xs'}>
      <ActionIcon
        onClick={() => navigateTo(navigationPath.length - 1)}
        aria-label={t('aria-labels.back')}
        disabled={navigationPath.length === 0}
      >
        <UpArrowIcon />
      </ActionIcon>
      <Breadcrumbs separatorMargin={0} separator={'>'}>
        <Button
          variant={'subtle'}
          p={2}
          onClick={() => navigateTo(0)}
          aria-label={t('aria-labels.home')}
        >
          <HomeIcon />
        </Button>
        {navigationPath.map((pathName, i) => (
          <Button
            key={`${pathName}_${i}`}
            p={2}
            variant={'subtle'}
            onClick={() => navigateTo(i + 1)}
            aria-label={t('aria-labels.breadcrumb', { path: pathName })}
          >
            {pathName}
          </Button>
        ))}
      </Breadcrumbs>
    </Group>
  );
}
