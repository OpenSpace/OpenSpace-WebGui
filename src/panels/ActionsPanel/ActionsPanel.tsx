import {
  ActionIcon,
  Breadcrumbs,
  Button,
  Group,
  Text,
  VisuallyHidden
} from '@mantine/core';

import { DynamicGrid } from '@/components/DynamicGrid/DynamicGrid';
import { FilterList } from '@/components/FilterList/FilterList';
import { generateMatcherFunctionByKeys } from '@/components/FilterList/util';
import { Layout } from '@/components/Layout/Layout';
import { BackArrowIcon, FolderIcon } from '@/icons/icons';
import { setActionsPath } from '@/redux/actions/actionsSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { Action } from '@/types/types';

import { ActionsButton } from './ActionsButton';
import { actionsForLevel, getDisplayedActions } from './util';

export function ActionsPanel() {
  const allActions = useAppSelector((state) => state.actions.actions);
  const navigationPath = useAppSelector((state) => state.actions.navigationPath);
  const isInitialized = useAppSelector((state) => state.actions.isInitialized);

  const dispatch = useAppDispatch();

  const actionLevel = actionsForLevel(allActions, navigationPath);
  const displayedActions = getDisplayedActions(allActions, navigationPath);

  const isTopLevel = navigationPath === '/';

  function addNavPath(path: string): void {
    const newPath = `${navigationPath}/${path}`.replace('//', '/');
    dispatch(setActionsPath(newPath));
  }

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

  function pathBreadbrumbs(): React.JSX.Element {
    const paths = navigationPath.split('/');
    return (
      <Breadcrumbs separatorMargin={0}>
        {paths.map((path, i) => (
          <Button
            key={`${path}_${i}`}
            p={2}
            variant={'subtle'}
            onClick={() => goToPath(path)}
          >
            {path}
          </Button>
        ))}
      </Breadcrumbs>
    );
  }

  if (!isInitialized || !actionLevel) {
    return <p>Loading...</p>;
  }

  return (
    <Layout>
      <Layout.FixedSection>
        {!isTopLevel && (
          <Group gap={'xs'} mb={'xs'}>
            <ActionIcon onClick={goBack}>
              <BackArrowIcon />
              <VisuallyHidden>Back</VisuallyHidden>
            </ActionIcon>
            {pathBreadbrumbs()}
          </Group>
        )}
      </Layout.FixedSection>
      <Layout.GrowingSection>
        <FilterList>
          <FilterList.InputField placeHolderSearchText={'Search for an action...'} />
          <FilterList.Favorites>
            <DynamicGrid spacing={'xs'} verticalSpacing={'xs'} minChildSize={170}>
              {actionLevel.folders.sort().map((folder) => (
                <Button
                  leftSection={<FolderIcon />}
                  onClick={() => addNavPath(folder)}
                  variant={'default'}
                  fullWidth
                  h={80} // TODO anden88 2025-02-06: use same css variable as ActionsButton
                  key={folder}
                >
                  <Text
                    lineClamp={3}
                    style={{ whiteSpace: 'wrap', wordBreak: 'break-all' }}
                  >
                    {folder}
                  </Text>
                </Button>
              ))}

              {actionLevel.actions.map((action: Action) => (
                <ActionsButton action={action} key={action.identifier} />
              ))}
            </DynamicGrid>
          </FilterList.Favorites>

          <FilterList.SearchResults
            data={displayedActions}
            renderElement={(action: Action) => (
              <ActionsButton key={action.identifier} action={action} />
            )}
            matcherFunc={generateMatcherFunctionByKeys(['identifier', 'name', 'guiPath'])}
          >
            <FilterList.SearchResults.VirtualList />
          </FilterList.SearchResults>
        </FilterList>
      </Layout.GrowingSection>
    </Layout>
  );
}
