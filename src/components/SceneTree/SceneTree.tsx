import { Tree } from '@mantine/core';

import { useAppSelector } from '@/redux/hooks';

import { FeaturedSceneTree } from './FeaturedSceneTree';
import { SceneTreeNode } from './SceneTreeNode';
import { sortTreeData } from './sortingUtil';
import { filterTreeData } from './treeUtil';

interface Props {
  showOnlyEnabled?: boolean;
  showHiddenNodes?: boolean;
}

/**
 * This component displays a tree of the scene graph, either starting from a certain
 * property owner, or the entire tree.
 */
export function SceneTree({ showOnlyEnabled = false, showHiddenNodes = false }: Props) {
  const sceneTreeData = useAppSelector((state) => state.groups.sceneTreeData);
  // TODO: Remove dependency on entire properties object. This means that the entire menu
  // is rerendered as soon as a property changes...
  const properties = useAppSelector((state) => state.properties.properties);
  const customGuiOrdering = useAppSelector((state) => state.groups.customGroupOrdering);

  let treeData = filterTreeData(
    sceneTreeData,
    showOnlyEnabled,
    showHiddenNodes,
    properties
  );
  treeData = sortTreeData(treeData, customGuiOrdering, properties);

  // TODO: Filter the nodes and property owners based on visiblity
  // TODO: Remember which parts of the menu were open?

  return (
    <>
      <FeaturedSceneTree
        showHiddenNodes={showHiddenNodes}
        showOnlyEnabled={showOnlyEnabled}
      />
      <Tree data={treeData} renderNode={(payload) => <SceneTreeNode {...payload} />} />
    </>
  );
}
