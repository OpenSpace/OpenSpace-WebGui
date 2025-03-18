import { Tree } from '@mantine/core';

import {
  useGetAimNode,
  useGetAnchorNode,
  useGetInterestingTagOwners
} from '@/util/propertyTreeHooks';
import {
  SceneTreeGroupPrefixKey,
  treeDataForSceneGraphNode
} from '@/util/sceneTreeGroupsHelper';

import { SceneTreeNode } from './SceneTreeNode';
import { SceneTreeNodeData } from './types';

/**
 * This component displays the current focus and aim of the camera, as well as the list of
 * nodes marked as interesting.
 */
export function FeaturedSceneTree() {
  const interestingOwners = useGetInterestingTagOwners();
  const anchorNode = useGetAnchorNode();
  const aimNode = useGetAimNode();

  const featuredTreeData: SceneTreeNodeData[] = [];

  if (anchorNode) {
    const anchorData = treeDataForSceneGraphNode(anchorNode.name, anchorNode.uri);
    anchorData.label = 'Current Focus: ' + anchorData.label;
    featuredTreeData.push(anchorData);
  }

  if (aimNode) {
    const aimData = treeDataForSceneGraphNode(aimNode.name, aimNode.uri);
    aimData.label = 'Current Aim: ' + aimData.label;
    featuredTreeData.push(aimData);
  }

  if (interestingOwners.length > 0) {
    featuredTreeData.push({
      label: 'Quick Access',
      value: SceneTreeGroupPrefixKey + 'interesting',
      children: interestingOwners.map((owner) =>
        treeDataForSceneGraphNode(owner.name, owner.uri)
      )
    });
  }

  return (
    <>
      <Tree
        data={featuredTreeData}
        renderNode={({
          node,
          expanded,
          elementProps,
          tree,
          level,
          hasChildren,
          selected
        }) => (
          <SceneTreeNode
            node={node}
            expanded={expanded}
            elementProps={elementProps}
            tree={tree}
            level={level}
            hasChildren={hasChildren}
            selected={selected}
          />
        )}
      />
    </>
  );
}
