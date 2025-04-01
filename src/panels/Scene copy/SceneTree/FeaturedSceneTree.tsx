import { Tree } from '@mantine/core';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setSceneTreeSelectedNode2 } from '@/redux/local/localSlice';
import {
  useAimNode,
  useAnchorNode,
  useInterestingTagOwners
} from '@/util/propertyTreeHooks';

import { SceneEntry } from '../SceneEntry';

import { SceneTreeNode } from './SceneTreeNode';
import { SceneTreeGroupPrefixKey, treeDataForSceneGraphNode } from './treeUtils';
import { SceneTreeNodeData } from './types';
/**
 * This component displays the current focus and aim of the camera, as well as the list of
 * nodes marked as interesting.
 */
export function FeaturedSceneTree() {
  const interestingOwners = useInterestingTagOwners();
  const anchorNode = useAnchorNode();
  const aimNode = useAimNode();

  const currentlySelectedNode = useAppSelector(
    (state) => state.local.sceneTree.currentlySelectedNode2
  );

  const dispatch = useAppDispatch();

  function setCurrentlySelectedNode(node: string) {
    dispatch(setSceneTreeSelectedNode2(node));
  }

  const anchorData = anchorNode
    ? treeDataForSceneGraphNode('Current Focus: ' + anchorNode.name, anchorNode.uri)
    : undefined;

  const aimData = aimNode
    ? treeDataForSceneGraphNode('Current Aim: ' + aimNode.name, aimNode.uri)
    : undefined;

  const featuredTreeData: SceneTreeNodeData[] = [];
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
      {anchorNode && (
        <SceneEntry
          node={anchorData!}
          isCurrentNode={anchorData!.value === currentlySelectedNode}
          onClick={() => setCurrentlySelectedNode(anchorData!.value)}
          expanded={false}
        />
      )}
      {aimNode && (
        <SceneEntry
          node={aimData!}
          isCurrentNode={aimData!.value === currentlySelectedNode}
          onClick={() => setCurrentlySelectedNode(aimData!.value)}
          expanded={false}
        />
      )}
      <Tree
        data={featuredTreeData}
        renderNode={({ node, expanded, elementProps, tree }) => (
          <SceneTreeNode
            node={node}
            expanded={expanded}
            tree={tree}
            elementProps={elementProps}
          >
            <SceneEntry
              node={node}
              expanded={expanded}
              isCurrentNode={node.value === currentlySelectedNode}
              onClick={() => setCurrentlySelectedNode(node.value)}
            />
          </SceneTreeNode>
        )}
      />
    </>
  );
}
