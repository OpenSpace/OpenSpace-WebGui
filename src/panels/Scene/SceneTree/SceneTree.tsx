import { useEffect } from 'react';
import {
  ActionIcon,
  Box,
  getTreeExpandedState,
  Group,
  Tooltip,
  Tree,
  useTree
} from '@mantine/core';
import { useSetState } from '@mantine/hooks';

import { FilterList } from '@/components/FilterList/FilterList';
import { useSearchKeySettings } from '@/components/FilterList/SearchSettingsMenu/hook';
import { generateMatcherFunctionByKeys } from '@/components/FilterList/util';
import { ChevronsDownIcon, ChevronsUpIcon } from '@/icons/icons';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { storeSceneTreeNodeExpanded } from '@/redux/local/localSlice';

import { useOpenCurrentSceneNodeWindow } from '../hooks';

import { useSceneTreeData } from './hooks';
import { SceneTreeFilters } from './SceneTreeFilters';
import { SceneTreeNode, SceneTreeNodeContent } from './SceneTreeNode';
import { SceneTreeGroupPrefixKey } from './treeUtils';
import {
  sceneTreeFilterDefaults,
  SceneTreeFilterSettings,
  SceneTreeNodeData
} from './types';

export function SceneTree() {
  const [filter, setFilter] = useSetState<SceneTreeFilterSettings>(
    sceneTreeFilterDefaults
  );

  const { allowedSearchKeys, toggleSearchKey, selectedSearchKeys } =
    useSearchKeySettings<SceneTreeNodeData>({
      label: true,
      guiPath: false
    });

  const keyLabels = { label: 'Name', guiPath: 'GUI Path' };

  const { sceneTreeData, flatTreeData } = useSceneTreeData(filter);
  const { closeCurrentNodeWindow } = useOpenCurrentSceneNodeWindow();

  const initialExpandedNodes = useAppSelector(
    (state) => state.local.sceneTree.expandedGroups
  );

  const tree = useTree({
    initialExpandedState: getTreeExpandedState(sceneTreeData, initialExpandedNodes)
  });

  const dispatch = useAppDispatch();

  // When the expanded nodes in the tree updates, also update the expanded state in redux
  useEffect(() => {
    return () => {
      // Convert the map to a list of strings with keys of the
      // expanded groups
      const expandedGroups = Object.entries(tree.expandedState)
        .filter(([key, isOpen]) => key.startsWith(SceneTreeGroupPrefixKey) && isOpen)
        .map(([key]) => key); // Save expanded state on unmount

      dispatch(storeSceneTreeNodeExpanded(expandedGroups));
    };
  }, [dispatch, tree.expandedState]);

  // This will only be run on unmount to close the window of the opened node
  useEffect(() => {
    return () => {
      closeCurrentNodeWindow();
    };
  }, [closeCurrentNodeWindow]);

  return (
    <FilterList>
      <Group justify={'space-between'} gap={'xs'} mr={'xs'}>
        <FilterList.InputField placeHolderSearchText={'Search for a node...'} flex={1} />
        <FilterList.SearchSettingsMenu
          keys={allowedSearchKeys}
          setKey={toggleSearchKey}
          labels={keyLabels}
        />
        <SceneTreeFilters setFilter={setFilter} filter={filter} />
      </Group>

      <FilterList.Favorites>
        {/* This box exists to ensure the absolute positioned chevrons end up in the
        right place */}
        <Box pos={'relative'}>
          <Group gap={0} pos={'absolute'} top={0} right={0}>
            <Tooltip label={'Collapse all'} position={'top'}>
              <ActionIcon
                variant={'subtle'}
                onClick={tree.collapseAllNodes}
                aria-label={'Collapse all nodes'}
              >
                <ChevronsUpIcon />
              </ActionIcon>
            </Tooltip>
            <Tooltip label={'Expand all'} position={'top'}>
              <ActionIcon
                variant={'subtle'}
                onClick={tree.expandAllNodes}
                aria-label={'Expand all nodes'}
              >
                <ChevronsDownIcon />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Box>
        <Tree
          data={sceneTreeData}
          tree={tree}
          renderNode={(payload) => <SceneTreeNode {...payload} />}
        />
      </FilterList.Favorites>

      <FilterList.SearchResults
        data={flatTreeData}
        renderElement={(node: SceneTreeNodeData) => (
          <SceneTreeNodeContent key={node.value} node={node} expanded={false} />
        )}
        matcherFunc={generateMatcherFunctionByKeys(selectedSearchKeys)}
      >
        <FilterList.SearchResults.VirtualList />
      </FilterList.SearchResults>
    </FilterList>
  );
}
