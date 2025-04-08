import { useMemo } from 'react';

import { useAppSelector } from '@/redux/hooks';
import {
  CustomGroupOrdering,
  Groups,
  Properties,
  PropertyOwners,
  Uri
} from '@/types/types';
import {
  isSgnHiddenInGui,
  isSgnVisible,
  sgnGuiOrderingNumber
} from '@/util/propertyTreeHelpers';

import {
  isGroupNode,
  SceneTreeGroupPrefixKey,
  treeDataForSceneGraphNode
} from './treeUtils';
import { SceneTreeFilterSettings, SceneTreeNodeData } from './types';

// Creates a tree data structure from the groups and a list of searchable nodes
// This is used to create the tree data for the SceneTree component
export function useSceneTreeData(filter: SceneTreeFilterSettings) {
  const properties = useAppSelector((state) => state.properties.properties);
  const propertyOwners = useAppSelector((state) => state.propertyOwners.propertyOwners);
  const groups = useAppSelector((state) => state.groups.groups);
  const customGuiOrdering = useAppSelector((state) => state.groups.customGroupOrdering);

  // Create the tree data from the groups
  const sceneTreeData = useMemo(
    () => sceneTreeDataFromGroups(groups, propertyOwners),
    [groups, propertyOwners]
  );

  // Filter the tree data based on the filter settings
  const filteredTreeData = useMemo(() => {
    return filterTreeData(sceneTreeData, filter, properties, propertyOwners);
  }, [sceneTreeData, filter, properties, propertyOwners]);

  // Sort the tree data based on the custom GUI ordering
  const sortedTreeData = useMemo(() => {
    return sortTreeData(filteredTreeData, customGuiOrdering, properties);
  }, [filteredTreeData, customGuiOrdering, properties]);

  // Create a flat list of all leaf nodes, that we can use for searching
  const flatTreeData = useMemo(() => {
    const flatTreeData = flattenTreeData(filteredTreeData);

    // @TODO (2025-01-13 emmbr): Would be nice to sort the results by some type of
    // "relevance", but for now we just sort alphabetically
    return flatTreeData.sort((a: SceneTreeNodeData, b: SceneTreeNodeData) => {
      const nameA = a.label as string;
      const nameB = b.label as string;
      return nameA.toLocaleLowerCase().localeCompare(nameB.toLocaleLowerCase());
    });
  }, [filteredTreeData]);

  return { sceneTreeData: sortedTreeData, flatTreeData };
}

/**
 * Create the data for the Scene tree from the groups information.
 */
function sceneTreeDataFromGroups(
  groups: Groups,
  propertyOwners: PropertyOwners
): SceneTreeNodeData[] {
  const treeData: SceneTreeNodeData[] = [];

  const topLevelGroupsPaths = Object.keys(groups).filter((path) => {
    // Get the number of slashes in the path
    const depth = (path.match(/\//g) || []).length;
    return depth === 1 && path !== '/';
  });

  // Build the data structure for the tree
  function generateGroupData(path: string) {
    const splitPath = path.split('/');
    const name = splitPath.length > 1 ? splitPath.pop() : 'Untitled';

    const groupNodeData: SceneTreeNodeData = {
      value: SceneTreeGroupPrefixKey + path,
      label: name,
      children: [],
      guiPath: path.split('/')
    };

    const groupData = groups[path];

    // Add subgroups, recursively
    groupData.subgroups.forEach((subGroupPath) =>
      groupNodeData.children?.push(generateGroupData(subGroupPath))
    );

    // Add property owners, also recursively
    groupData.propertyOwners.forEach((uri) => {
      const owner = propertyOwners[uri];
      if (owner === undefined) {
        return;
      }
      groupNodeData.children?.push(
        treeDataForSceneGraphNode(owner.name, owner.uri, path)
      );
    });

    return groupNodeData;
  }

  topLevelGroupsPaths.forEach((path) => {
    treeData.push(generateGroupData(path));
  });

  // Add the nodes without any group to the top level
  const nodesWithoutGroup = groups['/']?.propertyOwners || [];
  nodesWithoutGroup.forEach((uri) => {
    const owner = propertyOwners[uri];
    if (owner === undefined) {
      return;
    }
    treeData.push(treeDataForSceneGraphNode(owner.name, owner.uri));
  });

  return treeData;
}

/****************************************************************************************
 * FILTERING
 ****************************************************************************************/

function filterTreeData(
  nodes: SceneTreeNodeData[],
  filter: SceneTreeFilterSettings,
  properties: Properties,
  propertyOwners: PropertyOwners
): SceneTreeNodeData[] {
  // Should the scene graph node be shown based on the current filter settings?
  function shouldShowSceneGraphNode(uri: Uri) {
    let shouldShow = true;
    if (filter.showOnlyVisible) {
      shouldShow &&= isSgnVisible(uri, properties);
    }
    if (!filter.showHiddenNodes) {
      shouldShow &&= !isSgnHiddenInGui(uri, properties);
    }
    if (shouldShow && filter.tags.length > 0) {
      shouldShow &&= filter.tags.some((tag) => propertyOwners[uri]?.tags.includes(tag));
    }
    return shouldShow;
  }

  // Recursively apply filtering to one node in the tree. That is, if the node is a group,
  // filter its children. Set the nodes that should be filtered out to null, so that the
  // filtering can be done in a separate step.
  function recursivelyFilterSubTree(node: SceneTreeNodeData): SceneTreeNodeData | null {
    const newNode = { ...node };
    if (isGroupNode(newNode)) {
      // Groups => filter children
      newNode.children = filterTreeData(
        newNode.children || [],
        filter,
        properties,
        propertyOwners
      );
      if (newNode.children.length === 0) {
        // Don't show empty groups
        return null;
      }
      return newNode;
    } else {
      // PropertyOwners (scene graph nodes), may be filtered out based on current
      // filter settings
      return shouldShowSceneGraphNode(newNode.value) ? newNode : null;
    }
  }

  const filteredNodes = nodes
    .map((node) => recursivelyFilterSubTree(node))
    .filter((node) => node !== null);

  return filteredNodes || [];
}

/****************************************************************************************
 * SORTING
 ****************************************************************************************/

interface TreeSortingInfoEntry {
  type: 'propertyOwner' | 'group';
  name: string;
  guiOrder: number | undefined;
  payload: string;
}

interface TreeSortingInfo {
  [key: string]: TreeSortingInfoEntry;
}

function createTreeSortingInformation(
  treeData: SceneTreeNodeData[],
  properties: Properties
): TreeSortingInfo {
  const result: TreeSortingInfo = {};

  // Recursively add the sorting information for a node in the tree
  function addNode(node: SceneTreeNodeData) {
    if (isGroupNode(node)) {
      const groupPath = node.value.replace(SceneTreeGroupPrefixKey, '');
      result[node.value] = {
        type: 'group',
        name: node.label as string,
        guiOrder: undefined,
        payload: groupPath
      };
    } else {
      // Property owner
      result[node.value] = {
        type: 'propertyOwner',
        name: node.label as string,
        guiOrder: sgnGuiOrderingNumber(node.value, properties),
        payload: node.value
      };
    }

    if (node.children) {
      node.children.forEach(addNode);
    }
  }

  treeData.forEach((node) => {
    addNode(node);
  });

  return result;
}

/**
 * Sort a list of items in the scene menu tree. This is a bit complicated, since there are
 * multiple alternative ways to specify the order.
 */
function sortTreeLevel(
  treeListToSort: SceneTreeNodeData[],
  treeSortingInfo: TreeSortingInfo,
  customOrderNamesList: string[] | undefined
): SceneTreeNodeData[] {
  // Split the list up into three: 1) Any custom sorted objects, 2) numerically sorted
  // objects, and 3) alphabetically sorted. In most cases, all will be alphabetical.

  const customOrder: SceneTreeNodeData[] = [];
  const numericalOrder: SceneTreeNodeData[] = [];
  const alphabeticalOrder: SceneTreeNodeData[] = [];

  // In most cases there will be no custom ordering, so just use an empty array
  const orderedNames = customOrderNamesList || [];

  treeListToSort.forEach((node) => {
    const entry = treeSortingInfo[node.value];
    if (!entry) {
      throw Error(`Missing entry in treeSortingInfo for: ${node.value}`);
    }

    // Depending on how the entry should be sorted, add it to the correct list.
    // 1. If the name is in the custom order list, add it to the custom order list
    // 2. If a numerical guiOrder is defined, it should be sorted numerically
    // 3. Otherwise, sort alphabetically
    if (orderedNames.includes(entry.name)) {
      customOrder.push(node);
    } else if (entry.guiOrder !== undefined) {
      numericalOrder.push(node);
    } else {
      alphabeticalOrder.push(node);
    }
  });

  // Sort based on custom sort ordering
  customOrder.sort((nodeA, nodeB) => {
    const a = treeSortingInfo[nodeA.value];
    const b = treeSortingInfo[nodeB.value];

    const left = orderedNames.indexOf(a.name);
    const right = orderedNames.indexOf(b.name);

    if (left === right) {
      return 0; // keep original order
    }
    if (left === -1) {
      // left not in list => put last
      return 1;
    }
    if (right === -1) {
      // right not in list => put last
      return -1;
    }
    // Sort in alphabetical order
    return left < right ? -1 : 1;
  });

  // Numerical sorting based on provided guiOrdering number per scene graph node
  numericalOrder.sort((nodeA, nodeB) => {
    const a = treeSortingInfo[nodeA.value];
    const b = treeSortingInfo[nodeB.value];

    if (
      a.guiOrder === b.guiOrder ||
      a.guiOrder === undefined ||
      b.guiOrder === undefined
    ) {
      // Do alphabetic sort if number is the same
      return a.name.localeCompare(b.name, 'en');
    }

    return a.guiOrder > b.guiOrder ? 1 : -1;
  });

  // Alphabetical
  alphabeticalOrder.sort((nodeA, nodeB) => {
    const a = treeSortingInfo[nodeA.value];
    const b = treeSortingInfo[nodeB.value];
    return a.name.localeCompare(b.name, 'en');
  });

  return customOrder.concat(numericalOrder).concat(alphabeticalOrder);
}

function sortTreeData(
  treeData: SceneTreeNodeData[],
  customGuiOrderingMap: CustomGroupOrdering,
  properties: Properties
): SceneTreeNodeData[] {
  const treeSortingInfo = createTreeSortingInformation(treeData, properties);

  // Start with sorting the top level groups in the tree
  const customTopLevelOrdering = customGuiOrderingMap['/'];
  treeData = sortTreeLevel(treeData, treeSortingInfo, customTopLevelOrdering);

  // Then sort the children of each group, recursively
  function resursiveSortChildren(
    nodes: SceneTreeNodeData[],
    treeSortingInfo: TreeSortingInfo
  ) {
    return nodes.map((node) => {
      if (node.children && isGroupNode(node)) {
        const groupPath = node.value.replace(SceneTreeGroupPrefixKey, '');
        const customOrdering = customGuiOrderingMap[groupPath];
        node.children = sortTreeLevel(node.children, treeSortingInfo, customOrdering);
        node.children = resursiveSortChildren(node.children, treeSortingInfo);
      }
      return node;
    });
  }

  return resursiveSortChildren(treeData, treeSortingInfo);
}

/****************************************************************************************
 * SEARCHING
 ****************************************************************************************/

/**
 * The searching requires a flat list of all nodes in the tree. This function flattens the
 * tree data structure into a list of nodes.
 */
function flattenTreeData(treeData: SceneTreeNodeData[]): SceneTreeNodeData[] {
  const flatData: SceneTreeNodeData[] = [];

  function flatten(nodes: SceneTreeNodeData[]) {
    nodes.forEach((node) => {
      if (node.children) {
        flatten(node.children);
      } else {
        // Only add leaf nodes to the flat data
        flatData.push({
          ...node
        });
      }
    });
  }

  flatten(treeData);

  return flatData;
}
