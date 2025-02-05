import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActionIcon,
  getTreeExpandedState,
  Group,
  Tooltip,
  Tree,
  TreeNodeData,
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

  // Ref to keep track of which groups are currently expanded. The reason it is a ref is
  // since we need this object to exist for the entire lifetime of the component,
  // including on unmount
  const expandedGroups = useRef<string[]>(initialExpandedNodes);

  function isGroup(value: string): boolean {
    return value.startsWith(SceneTreeGroupPrefixKey);
  }

  const tree = useTree({
    initialExpandedState: getTreeExpandedState(sceneTreeData, initialExpandedNodes),
    onNodeExpand: (value) => {
      if (isGroup(value) && !expandedGroups.current.includes(value)) {
        expandedGroups.current = [...expandedGroups.current, value];
      }
    },
    onNodeCollapse: (value: string) => {
      if (isGroup(value)) {
        expandedGroups.current = expandedGroups.current.filter((v) => v !== value);
      }
    }
  });

  const dispatch = useAppDispatch();

  // This will only be run on unmount
  useEffect(() => {
    return () => {
      // Save expanded state on unmount
      dispatch(storeSceneTreeNodeExpanded(expandedGroups.current));
      // Also close the "current node" window
      closeCurrentNodeWindow();
    };
  }, [dispatch, closeCurrentNodeWindow]);

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
  flatTreeData.sort((a: TreeNodeData, b: TreeNodeData) => {
    const nameA = a.label as string;
    const nameB = b.label as string;
    return nameA.toLocaleLowerCase().localeCompare(nameB.toLocaleLowerCase());
  });

  return (
    <FilterList>
      <Group justify={'space-between'}>
        <FilterList.InputField placeHolderSearchText={'Search for a node...'} flex={1} />
        <SceneTreeFilters onFilterChange={setFilter} />
      </Group>

      <FilterList.Favorites>
        <Group gap={0} pos={'absolute'} top={0} right={0}>
          <Tooltip
            label={'Collapse all'}
            position={'top'}
            transitionProps={{ enterDelay: 400 }}
            withArrow
          >
            <ActionIcon variant={'subtle'} onClick={tree.collapseAllNodes}>
              <ChevronsUpIcon />
            </ActionIcon>
          </Tooltip>
          <Tooltip
            label={'Expand all'}
            position={'top'}
            transitionProps={{ enterDelay: 400 }}
            withArrow
          >
            <ActionIcon variant={'subtle'} onClick={tree.expandAllNodes}>
              <ChevronsDownIcon />
            </ActionIcon>
          </Tooltip>
        </Group>
        <Tree
          data={treeData}
          tree={tree}
          renderNode={(payload) => <SceneTreeNode {...payload} />}
        />
      </FilterList.Favorites>

      <FilterList.SearchResults>
        <FilterList.SearchResults.VirtualList<TreeNodeData>
          data={flatTreeData}
          renderElement={(node: TreeNodeData) => (
            <SceneTreeNodeContent key={node.value} node={node} expanded={false} />
          )}
          matcherFunc={generateMatcherFunctionByKeys(['label'])} // For now we just use the name
        />
      </FilterList.SearchResults>
    </FilterList>
  );
}
