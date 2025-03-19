import { useEffect, useMemo, useState } from 'react';
import {
  ActionIcon,
  Box,
  getTreeExpandedState,
  Group,
  Tooltip,
  Tree,
  useTree
} from '@mantine/core';

import { FilterList } from '@/components/FilterList/FilterList';
import { generateMatcherFunctionByKeys } from '@/components/FilterList/util';
import { ChevronsDownIcon, ChevronsUpIcon } from '@/icons/icons';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { storeSceneTreeNodeExpanded } from '@/redux/local/localSlice';
import { SceneTreeGroupPrefixKey } from '@/util/sceneTreeGroupsHelper';

import { useOpenCurrentSceneNodeWindow } from '../hooks';

import { SceneTreeFilters } from './SceneTreeFilters';
import { SceneTreeNode, SceneTreeNodeContent } from './SceneTreeNode';
import {
  filterTreeData,
  flattenTreeData,
  SceneTreeFilterSettings,
  sortTreeData
} from './treeUtil';
import { SceneTreeNodeData } from './types';

export function SceneTree() {
  const [filter, setFilter] = useState<SceneTreeFilterSettings>({
    showOnlyVisible: false,
    showHiddenNodes: false,
    tags: []
  });

  const { closeCurrentNodeWindow } = useOpenCurrentSceneNodeWindow();

  const sceneTreeData = useAppSelector((state) => state.groups.sceneTreeData);
  // @TODO (emmbr, 2024-12-17): Remove dependency on entire properties object. This means
  // that the entire menu is rerendered as soon as a property changes... Alternatively,
  // update state structure so that the property values are stored in a separate object
  const properties = useAppSelector((state) => state.properties.properties);
  const propertyOwners = useAppSelector((state) => state.propertyOwners.propertyOwners);
  const customGuiOrdering = useAppSelector((state) => state.groups.customGroupOrdering);

  const initialExpandedNodes = useAppSelector(
    (state) => state.local.sceneTree.expandedGroups
  );

  function isGroup(value: string): boolean {
    return value.startsWith(SceneTreeGroupPrefixKey);
  }

  const tree = useTree({
    initialExpandedState: getTreeExpandedState(sceneTreeData, initialExpandedNodes)
  });

  const dispatch = useAppDispatch();

  // This will only be run on unmount
  useEffect(() => {
    return () => {
      // Convert the map to a list of strings with keys of the
      // expanded groups
      const expandedGroups = Object.entries(tree.expandedState)
        .filter(([key, isOpen]) => isGroup(key) && isOpen)
        .map(([key]) => key); // Save expanded state on unmount

      dispatch(storeSceneTreeNodeExpanded(expandedGroups));
      // Also close the "current node" window
      closeCurrentNodeWindow();
    };
  }, [dispatch, closeCurrentNodeWindow, tree.expandedState]);

  // If the sorting is not wrapped in an useMemo, the component will rerender constantly,
  // for some reason
  const treeData = useMemo(() => {
    let data = sceneTreeData;
    data = filterTreeData(data, filter, properties, propertyOwners);
    data = sortTreeData(data, customGuiOrdering, properties);
    return data;
  }, [customGuiOrdering, filter, properties, propertyOwners, sceneTreeData]);

  // Create a flat list of all leaf nodes, that we can use for searching
  const flatTreeData = flattenTreeData(treeData);

  // @TODO (2025-01-13 emmbr): Would be nice to sort the results by some type of
  // "relevance", but for now we just sort alphabetically
  flatTreeData.sort((a: SceneTreeNodeData, b: SceneTreeNodeData) => {
    const nameA = a.label as string;
    const nameB = b.label as string;
    return nameA.toLocaleLowerCase().localeCompare(nameB.toLocaleLowerCase());
  });

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
          data={treeData}
          tree={tree}
          renderNode={(payload) => <SceneTreeNode {...payload} />}
        />
      </FilterList.Favorites>

      <FilterList.SearchResults
        data={flatTreeData}
        renderElement={(node: SceneTreeNodeData) => (
          <SceneTreeNodeContent key={node.value} node={node} expanded={false} />
        )}
        matcherFunc={generateMatcherFunctionByKeys(['label', 'guiPath'])} // For now we just use the name
      >
        <FilterList.SearchResults.VirtualList />
      </FilterList.SearchResults>
    </FilterList>
  );
}
