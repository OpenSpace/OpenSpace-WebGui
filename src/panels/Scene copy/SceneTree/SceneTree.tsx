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
import { generateMatcherFunctionByKeys } from '@/components/FilterList/util';
import { ChevronsDownIcon, ChevronsUpIcon } from '@/icons/icons';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  setSceneTreeSelectedNode2,
  storeSceneTreeNodeExpanded
} from '@/redux/local/localSlice';

import { SceneEntry } from '../SceneEntry';

import { useSceneTreeData } from './hooks';
import { SceneTreeFilters } from './SceneTreeFilters';
import { SceneTreeNode } from './SceneTreeNode';
import { SceneTreeGroupPrefixKey } from './treeUtils';
import { SceneTreeFilterSettings, SceneTreeNodeData } from './types';

export function SceneTree() {
  const [filter, setFilter] = useSetState<SceneTreeFilterSettings>({
    showOnlyVisible: false,
    showHiddenNodes: false,
    tags: []
  });

  const { sceneTreeData, flatTreeData } = useSceneTreeData(filter);

  const currentlySelectedNode = useAppSelector(
    (state) => state.local.sceneTree.currentlySelectedNode2
  );
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

  function setCurrentlySelectedNode(node: string) {
    dispatch(setSceneTreeSelectedNode2(node));
  }

  return (
    <FilterList>
      <Group justify={'space-between'} gap={'xs'} mr={'xs'}>
        <FilterList.InputField placeHolderSearchText={'Search for a node...'} flex={1} />
        <SceneTreeFilters setFilter={setFilter} filter={filter} />
      </Group>

      <FilterList.Favorites>
        {/* This box exists to ensure the absolute positioned chevrons end up in the
        right place */}
        <Box pos={'relative'}>
          <Group gap={0} pos={'absolute'} top={0} right={0}>
            <Tooltip label={'Collapse all'} position={'top'}>
              <ActionIcon variant={'subtle'} onClick={tree.collapseAllNodes}>
                <ChevronsUpIcon />
              </ActionIcon>
            </Tooltip>
            <Tooltip label={'Expand all'} position={'top'}>
              <ActionIcon variant={'subtle'} onClick={tree.expandAllNodes}>
                <ChevronsDownIcon />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Box>
        <Tree
          data={sceneTreeData}
          tree={tree}
          renderNode={({ node, expanded, ...payload }) => (
            <SceneTreeNode node={node} expanded={expanded} {...payload}>
              <SceneEntry
                node={node}
                expanded={expanded}
                isCurrentNode={node.value === currentlySelectedNode}
                onClick={() => setCurrentlySelectedNode(node.value)}
              />
            </SceneTreeNode>
          )}
        />
      </FilterList.Favorites>

      <FilterList.SearchResults
        data={flatTreeData}
        renderElement={(node: SceneTreeNodeData) => (
          <SceneEntry
            key={node.value}
            node={node}
            expanded={false}
            isCurrentNode={node.value === currentlySelectedNode}
            onClick={() => setCurrentlySelectedNode(node.value)}
          />
        )}
        matcherFunc={generateMatcherFunctionByKeys(['label', 'guiPath'])} // For now we just use the name
      >
        <FilterList.SearchResults.VirtualList />
      </FilterList.SearchResults>
    </FilterList>
  );
}
