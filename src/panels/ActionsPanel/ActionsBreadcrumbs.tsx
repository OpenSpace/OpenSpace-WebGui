import { ActionIcon, Breadcrumbs, Button, Group } from '@mantine/core';

import { HomeIcon, UpArrowIcon } from '@/icons/icons';
import { setActionsPath } from '@/redux/actions/actionsSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';

export function ActionsBreadcrumbs() {
  const navigationPath = useAppSelector((state) => state.actions.navigationPath);
  const dispatch = useAppDispatch();

  const isTopLevel = navigationPath === '/';
  const paths = isTopLevel ? [''] : navigationPath.split('/');

  function goUp(): void {
    let newPath = navigationPath.substring(0, navigationPath.lastIndexOf('/'));
    if (newPath.length === 0) {
      newPath = '/';
    }
    dispatch(setActionsPath(newPath));
  }

  function goToPath(path: string): void {
    const destinationIndex = paths.indexOf(path);
    const navPath = paths.slice(0, destinationIndex + 1).join('/');
    const newPath = navPath === '' ? '/' : navPath;
    dispatch(setActionsPath(newPath));
  }

  return (
    <Group gap={'xs'} mb={'xs'}>
      <ActionIcon onClick={goUp} aria-label={'Back'} disabled={isTopLevel}>
        <UpArrowIcon />
      </ActionIcon>
      <Breadcrumbs separatorMargin={0}>
        {paths.map((path, i) => (
          <Button
            key={`${path}_${i}`}
            p={2}
            variant={'subtle'}
            onClick={() => goToPath(path)}
          >
            {path === '' ? <HomeIcon /> : path}
          </Button>
        ))}
      </Breadcrumbs>
    </Group>
  );
}
