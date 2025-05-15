import { useTranslation } from 'react-i18next';
import { ActionIcon, Breadcrumbs, Button, Group } from '@mantine/core';

import { HomeIcon, UpArrowIcon } from '@/icons/icons';
import { setActionsPath } from '@/redux/actions/actionsSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';

import { calculateLevelDepth, createPath, getFolders } from './util';

export function ActionsBreadcrumbs() {
  const navigationPath = useAppSelector((state) => state.actions.navigationPath);
  const { t } = useTranslation('actionpanel');
  const dispatch = useAppDispatch();

  const currentLevel = calculateLevelDepth(navigationPath);
  const folders = getFolders(navigationPath);
  const isTopLevel = currentLevel === 0;

  function goToLevel(i: number): void {
    // If we are at the top level, we should go to the home page
    if (i === 0) {
      dispatch(setActionsPath('/'));
      return;
    }
    // Add 1 as slice doesn't include the i:th element
    const newFolders = folders.slice(0, i + 1);

    dispatch(setActionsPath(createPath(newFolders)));
  }

  return (
    <Group gap={'xs'} mb={'xs'}>
      <ActionIcon
        onClick={() => goToLevel(currentLevel - 1)}
        aria-label={t('breadcrumbs-aria-label')}
        disabled={isTopLevel}
      >
        <UpArrowIcon />
      </ActionIcon>
      <Breadcrumbs separatorMargin={0}>
        {folders.map((path, i) => (
          <Button
            key={`${path}_${i}`}
            p={2}
            variant={'subtle'}
            onClick={() => goToLevel(i)}
          >
            {path === '' ? <HomeIcon /> : path}
          </Button>
        ))}
      </Breadcrumbs>
    </Group>
  );
}
