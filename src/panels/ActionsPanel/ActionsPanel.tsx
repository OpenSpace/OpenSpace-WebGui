import {
  ActionIcon,
  Breadcrumbs,
  Button,
  Container,
  Group,
  ScrollArea,
  Text,
  VisuallyHidden
} from '@mantine/core';

import { DynamicGrid } from '@/components/DynamicGrid/DynamicGrid';
import { FilterList } from '@/components/FilterList/FilterList';
import { generateMatcherFunctionByKeys } from '@/components/FilterList/util';
import { BackArrowIcon, FolderIcon } from '@/icons/icons';
import { setActionsPath } from '@/redux/actions/actionsSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { Action } from '@/types/types';

import { ActionsButton } from './ActionsButton';
import { actionsForLevel, getDisplayedActions, truncatePath } from './util';

import './ActionsPanel.css';

export function ActionsPanel() {
  const allActions = useAppSelector((state) => state.actions.actions);
  const navigationPath = useAppSelector((state) => state.actions.navigationPath);
  const isInitialized = useAppSelector((state) => state.actions.isInitialized);

  const dispatch = useAppDispatch();

  const actionLevel = actionsForLevel(allActions, navigationPath);
  const displayedNavigationPath = truncatePath(navigationPath);
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
    const paths = displayedNavigationPath.split('/');
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
    <ScrollArea h={'100%'}>
      <Container mt={'xs'}>
        {!isTopLevel && (
          <Group gap={'xs'} mb={'xs'}>
            <ActionIcon onClick={goBack}>
              <BackArrowIcon />
              <VisuallyHidden>Back</VisuallyHidden>
            </ActionIcon>
            {pathBreadbrumbs()}
          </Group>
        )}
        <FilterList>
          <FilterList.InputField placeHolderSearchText={'Search for an action...'} />
          <FilterList.Favorites>
            <DynamicGrid gutter={'xs'} minChildSize={150} className={'actionsPanelGrid'}>
              {actionLevel.folders.sort().map((folder, i) => (
                <DynamicGrid.Col key={`${folder}_${i}`}>
                  <Button
                    leftSection={<FolderIcon />}
                    onClick={() => addNavPath(folder)}
                    variant={'default'}
                    fullWidth
                    h={80} // TODO anden88 2025-02-06: use same css variable as ActionsButton
                  >
                    <Text style={{ whiteSpace: 'wrap', wordBreak: 'break-all' }}>
                      {folder}
                    </Text>
                  </Button>
                </DynamicGrid.Col>
              ))}

              {actionLevel.actions.map((action: Action) => (
                <DynamicGrid.Col key={`${action.identifier}_action`}>
                  <ActionsButton action={action} />
                </DynamicGrid.Col>
              ))}
            </DynamicGrid>
          </FilterList.Favorites>
          <FilterList.Data<Action>
            data={displayedActions}
            renderElement={(action: Action) => (
              <ActionsButton key={`${action.identifier}Filtered`} action={action} />
            )}
            matcherFunc={generateMatcherFunctionByKeys(['identifier', 'name', 'guiPath'])}
          />
        </FilterList>
      </Container>
    </ScrollArea>
  );
}
