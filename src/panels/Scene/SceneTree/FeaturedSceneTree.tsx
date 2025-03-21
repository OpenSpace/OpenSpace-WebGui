import { Box, Tree } from '@mantine/core';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setSceneTreeSelectedNode } from '@/redux/local/localSlice';
import {
  useGetAimNode,
  useGetAnchorNode,
  useGetInterestingTagOwners
} from '@/util/propertyTreeHooks';

import { SceneEntry, SceneTreeNode } from './SceneTreeNode';
import { SceneTreeGroupPrefixKey, treeDataForSceneGraphNode } from './treeUtils';
import { SceneTreeNodeData } from './types';

import styles from './FeaturedSceneTree.module.css';
/**
 * This component displays the current focus and aim of the camera, as well as the list of
 * nodes marked as interesting.
 */
export function FeaturedSceneTree() {
  const interestingOwners = useGetInterestingTagOwners();
  const anchorNode = useGetAnchorNode();
  const aimNode = useGetAimNode();

  const currentlySelectedNode = useAppSelector(
    (state) => state.local.sceneTree.currentlySelectedNode
  );

  const dispatch = useAppDispatch();

  function setCurrentlySelectedNode(node: string) {
    dispatch(setSceneTreeSelectedNode(node));
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
        // The key here is necessary to make sure that the component is re-rendered when the
        // anchor node changes, to trigger the animation
        <Box key={anchorNode.uri} className={styles.highlight}>
          <SceneEntry
            node={anchorData!}
            isCurrentNode={anchorData!.value === currentlySelectedNode}
            onClick={() => setCurrentlySelectedNode(anchorData!.value)}
            expanded={false}
          />
        </Box>
      )}
      {aimNode && (
        // The key here is necessary to make sure that the component is re-rendered when the
        // anchor node changes, to trigger the animation
        <Box key={`${aimNode.uri}aim`} className={styles.highlight}>
          <SceneEntry
            node={aimData!}
            isCurrentNode={aimData!.value === currentlySelectedNode}
            onClick={() => setCurrentlySelectedNode(aimData!.value)}
            expanded={false}
          />
        </Box>
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
