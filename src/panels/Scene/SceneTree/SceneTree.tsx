import { useEffect, useMemo, useRef } from 'react';
import { FiChevronsDown, FiChevronsUp } from 'react-icons/fi';
import {
  ActionIcon,
  Box,
  getTreeExpandedState,
  Group,
  Tooltip,
  Tree,
  TreeNodeData,
  useTree
} from '@mantine/core';

import { FilterList } from '@/components/FilterList/FilterList';
import { generateMatcherFunctionByKeys } from '@/components/FilterList/util';
import { storeSceneTreeNodeExpanded } from '@/redux/groups/groupsSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';

import { useOpenCurrentSceneNodeWindow } from '../hooks';

import { FeaturedSceneTree } from './FeaturedSceneTree';
import { SceneTreeNode, SceneTreeNodeStyled } from './SceneTreeNode';
import { sortTreeData } from './sortingUtil';
import { filterTreeData, isGroup, SceneTreeFilterProps } from './treeUtil';

interface Props {
  filter: SceneTreeFilterProps;
}

// @TODO (emmbr, 2024-12-03): Make the search more sophisticated. For example, include
// information about the gui path as well. Could be hidden under a setting. Started doing
// this but it needs some more afterthought. So just left this data structure here for now
interface SearchData extends TreeNodeData {
  guiPath: string | undefined;
}

export function SceneTree({ filter }: Props) {
  const { closeCurrentNodeWindow } = useOpenCurrentSceneNodeWindow();

  const sceneTreeData = useAppSelector((state) => state.groups.sceneTreeData);
  // TODO: Remove dependency on entire properties object. This means that the entire menu
  // is rerendered as soon as a property changes... Alternatively, update state structure
  // so that the property values are stored in a separate object.
  const properties = useAppSelector((state) => state.properties.properties);
  const propertyOwners = useAppSelector((state) => state.propertyOwners.propertyOwners);
  const customGuiOrdering = useAppSelector((state) => state.groups.customGroupOrdering);

  const initialExpandedNodes = useAppSelector((state) => state.groups.expandedGroups);

  // We use a ref here, since we need this object to exists for the entire lifetime of the
  // component, including when the component is unmounted
  const expandedGroups = useRef<string[]>(initialExpandedNodes);

  const tree = useTree({
    initialExpandedState: getTreeExpandedState(sceneTreeData, initialExpandedNodes),
    onNodeExpand: (value) => {
      if (isGroup(value) && !expandedGroups.current.includes(value)) {
        expandedGroups.current = [...expandedGroups.current, value];
      }
    },
    onNodeCollapse: (value) => {
      if (isGroup(value)) {
        expandedGroups.current = expandedGroups.current.filter((v) => v !== value);
      }
    }
  });

  const dispatch = useAppDispatch();
  useEffect(() => {
    return () => {
      // Save expanded state on unmount
      dispatch(storeSceneTreeNodeExpanded(expandedGroups.current));
      // Also close the "current node" window
      closeCurrentNodeWindow();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // If the sorting is not wrapped in an useMemo, the component will rerender constantly,
  // for some reason
  const treeData = useMemo(() => {
    let data = sceneTreeData;
    data = filterTreeData(data, filter, properties, propertyOwners);
    data = sortTreeData(data, customGuiOrdering, properties);
    return data;
  }, [customGuiOrdering, filter, properties, propertyOwners, sceneTreeData]);

  function flattenTreeData(treeData: TreeNodeData[]): SearchData[] {
    const flatData: SearchData[] = [];

    function flatten(nodes: TreeNodeData[]) {
      nodes.forEach((node) => {
        if (node.children) {
          flatten(node.children);
        } else {
          // Only add leaf nodes to the flat data
          flatData.push({
            ...node,
            guiPath: properties[`${node.value}.GuiPath`]?.value as string | undefined
          });
        }
      });
    }
    flatten(treeData);
    return flatData;
  }
  const flatTreeData = flattenTreeData(treeData);

  // TODO: Would be nice to sort the results by some type of "relevance", but for now we
  // just sort by name
  flatTreeData.sort((a, b) => {
    const nameA = a.label as string;
    const nameB = b.label as string;
    return nameA.toLocaleLowerCase().localeCompare(nameB.toLocaleLowerCase());
  });

  return (
    <FilterList>
      <FilterList.Favorites>
        <FeaturedSceneTree filter={filter} />
        <Box pos={'relative'}>
          <Tree
            data={treeData}
            tree={tree}
            renderNode={(payload) => <SceneTreeNodeStyled {...payload} />}
          />
          <Group gap={0} pos={'absolute'} top={0} right={0}>
            {/* TODO: what icons to use here? */}
            <Tooltip
              label={'Collapse all'}
              position={'top'}
              transitionProps={{ enterDelay: 400 }}
              withArrow
            >
              <ActionIcon variant={'subtle'} onClick={tree.collapseAllNodes}>
                <FiChevronsUp />
              </ActionIcon>
            </Tooltip>
            <Tooltip
              label={'Expand all'}
              position={'top'}
              transitionProps={{ enterDelay: 400 }}
              withArrow
            >
              <ActionIcon variant={'subtle'} onClick={tree.expandAllNodes}>
                <FiChevronsDown />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Box>
      </FilterList.Favorites>
      <FilterList.Data<SearchData>
        data={flatTreeData}
        renderElement={(node: SearchData) => (
          <SceneTreeNode key={node.value} node={node} expanded={false} />
        )}
        matcherFunc={generateMatcherFunctionByKeys(['label'])} // For now we just use the name
      />
    </FilterList>
  );
}
