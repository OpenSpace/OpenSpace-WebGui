import { DynamicGrid } from '@/components/DynamicGrid/DynamicGrid';
import { FilterList } from '@/components/FilterList/FilterList';
import { generateMatcherFunctionByKeys } from '@/components/FilterList/util';
import { Layout } from '@/components/Layout/Layout';
import { LoadingBlocks } from '@/components/LoadingBlocks/LoadingBlocks';
import { useAppSelector } from '@/redux/hooks';
import { Action } from '@/types/types';

import { ActionsBreadcrumbs } from './ActionsBreadcrumbs';
import { ActionsButton } from './ActionsButton';
import { ActionsFolder } from './ActionsFolder';
import { ActionsSearchInputField } from './ActionsSearchInputField';
import { useActionsForLevel, useActionsInPath } from './hooks';

export function ActionsPanel() {
  const isInitialized = useAppSelector((state) => state.actions.isInitialized);

  const actionLevel = useActionsForLevel();
  const actionsInPath = useActionsInPath();

  // TODO anden88 2025-02-06: use same css variable as ActionsButton
  const ButtonHeight = 80;

  if (!isInitialized || !actionLevel) {
    return <LoadingBlocks />;
  }

  return (
    <Layout>
      <Layout.FixedSection>
        <ActionsBreadcrumbs />
      </Layout.FixedSection>
      <Layout.GrowingSection>
        <FilterList>
          {/* This is a custom variant of the FilterList input field */}
          <ActionsSearchInputField placeHolderSearchText={'Search for an action...'} />
          <FilterList.Favorites>
            <DynamicGrid spacing={'xs'} verticalSpacing={'xs'} minChildSize={170}>
              {actionLevel.folders.sort().map((folder) => (
                <ActionsFolder key={folder} folder={folder} height={ButtonHeight} />
              ))}
              {actionLevel.actions.map((action: Action) => (
                <ActionsButton
                  action={action}
                  key={action.identifier}
                  height={ButtonHeight}
                />
              ))}
            </DynamicGrid>
          </FilterList.Favorites>

          <FilterList.SearchResults
            data={actionsInPath}
            renderElement={(action: Action) => (
              <ActionsButton
                key={action.identifier}
                action={action}
                height={ButtonHeight}
              />
            )}
            matcherFunc={generateMatcherFunctionByKeys([
              'identifier',
              'name',
              'guiPath',
              'documentation'
            ])}
          >
            <FilterList.SearchResults.VirtualList gap={'xs'} />
          </FilterList.SearchResults>
        </FilterList>
      </Layout.GrowingSection>
    </Layout>
  );
}
