import { TreeNodeData } from '@mantine/core';

import { Properties } from '@/types/types';
import { guiOrderingNumber } from '@/util/propertyTreeHelpers';

import { GroupPrefixKey, isGroupNode } from './treeUtil';

interface TreeSortingInfoEntry {
  type: 'propertyOwner' | 'group';
  payload: string;
  name: string;
  guiOrder: number | undefined;
}

interface TreeSortingInfo {
  [key: string]: TreeSortingInfoEntry;
}

export function createTreeSortingInformation(
  treeData: TreeNodeData[],
  properties: Properties
): TreeSortingInfo {
  const result: TreeSortingInfo = {};
  treeData.forEach((node) => {
    function addNode(node: TreeNodeData) {
      if (isGroupNode(node)) {
        const groupPath = node.value.replace(GroupPrefixKey, '');
        result[node.value] = {
          type: 'group',
          payload: groupPath,
          name: node.label as string,
          guiOrder: undefined
        };
      } else {
        // Property owner
        result[node.value] = {
          type: 'propertyOwner',
          payload: node.value,
          name: node.label as string,
          guiOrder: guiOrderingNumber(properties, node.value)
        };
      }

      if (node.children) {
        node.children.forEach(addNode);
      }
    }
    addNode(node);
  });

  return result;
}

// Sort a list of items in the scene menu tree. This is a bit complicated, since there are
// multiple alternative ways to specify the order.
export function sortTreeLevel(
  treeListToSort: TreeNodeData[],
  treeSortingInfo: TreeSortingInfo,
  customOrderNamesList: string[] | undefined
): TreeNodeData[] {
  // Split the list up into three: 1) Any custom sorted objects, 2) numerically sorted
  // objects, and 3) alphabetically sorted. In most cases, all will be alphabetical.

  const customOrder: TreeNodeData[] = [];
  const numericalOrder: TreeNodeData[] = [];
  const alphabeticalOrder: TreeNodeData[] = [];

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

export function sortTreeData(
  treeData: TreeNodeData[],
  customGuiOrderingMap: { [key: string]: string[] },
  properties: Properties
): TreeNodeData[] {
  const treeSortingInfo = createTreeSortingInformation(treeData, properties);

  // Start with sorting the top level groups in the tree
  const customTopLevelOrdering = customGuiOrderingMap['/'];
  treeData = sortTreeLevel(treeData, treeSortingInfo, customTopLevelOrdering);

  // Then sort the children of each group, recursively
  function resursiveSortChildren(
    nodes: TreeNodeData[],
    treeSortingInfo: TreeSortingInfo
  ) {
    return nodes.map((node) => {
      const n = { ...node };
      if (n.children) {
        if (isGroupNode(n)) {
          const groupPath = node.value.replace(GroupPrefixKey, '');
          const customOrdering = customGuiOrderingMap[groupPath];
          n.children = sortTreeLevel(n.children, treeSortingInfo, customOrdering);
          n.children = resursiveSortChildren(n.children, treeSortingInfo);
        }
      }
      return n;
    });
  }

  treeData = resursiveSortChildren(treeData, treeSortingInfo);

  return treeData;
}
