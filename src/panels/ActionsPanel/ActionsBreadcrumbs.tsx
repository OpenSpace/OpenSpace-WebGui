import { ActionIcon, Breadcrumbs, Button, Group } from '@mantine/core';

import { BackArrowIcon, HomeIcon } from '@/icons/icons';
import { setActionsPath } from '@/redux/actions/actionsSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';

export function ActionsBreadcrumbs() {
  const navigationPath = useAppSelector((state) => state.actions.navigationPath);
  const dispatch = useAppDispatch();

  const isTopLevel = navigationPath === '/';
  const paths = navigationPath.split('/');

  function goBack(): void {
    let newPath = navigationPath.substring(0, navigationPath.lastIndexOf('/'));
    if (newPath.length === 0) {
      newPath = '/';
    }
    dispatch(setActionsPath(newPath));
  }

  function goToPath(path: string): void {
    const index = navigationPath.indexOf(path);
    // If we don't find the path e.g., when '...' is displayed go back one step
    if (index === -1) {
      goBack();
      return;
    }
    let navPath = navigationPath.substring(0, index + path.length);
    if (navPath.length === 0) {
      navPath = '/';
    }
    dispatch(setActionsPath(navPath));
  }

  if (isTopLevel) {
    return <></>;
  }

  return (
    <Group gap={'xs'} mb={'xs'}>
      <ActionIcon onClick={goBack} aria-label={'Back'}>
        <BackArrowIcon />
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
