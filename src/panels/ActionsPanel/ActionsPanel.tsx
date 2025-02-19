import { Button, Container, ScrollArea, Text } from '@mantine/core';

import { DynamicGrid } from '@/components/DynamicGrid/DynamicGrid';
import { FilterList } from '@/components/FilterList/FilterList';
import { generateMatcherFunctionByKeys } from '@/components/FilterList/util';
import { LoadingBlocks } from '@/components/LoadingBlocks/LoadingBlocks';
import { FolderIcon } from '@/icons/icons';
import { setActionsPath } from '@/redux/actions/actionsSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { Action } from '@/types/types';

import { ActionsBreadcrumbs } from './ActionsBreadcrumbs';
import { ActionsButton } from './ActionsButton';
import { actionsForLevel, getDisplayedActions } from './util';

export function ActionsPanel() {
  const allActions = useAppSelector((state) => state.actions.actions);
  const isInitialized = useAppSelector((state) => state.actions.isInitialized);
  const navigationPath = useAppSelector((state) => state.actions.navigationPath);

  const dispatch = useAppDispatch();

  const actionLevel = actionsForLevel(allActions, navigationPath);
  const displayedActions = getDisplayedActions(allActions, navigationPath);

  function addNavPath(path: string): void {
    const newPath = `${navigationPath}/${path}`.replace('//', '/');
    dispatch(setActionsPath(newPath));
  }

  if (!isInitialized || !actionLevel) {
    return <LoadingBlocks />;
  }

  return (
    <ScrollArea h={'100%'}>
      <Container mt={'xs'}>
        <ActionsBreadcrumbs />
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
      </Container>
    </ScrollArea>
  );
}
