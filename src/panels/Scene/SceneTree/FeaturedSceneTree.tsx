import { Tree } from '@mantine/core';

import { useGetStringPropertyValue } from '@/api/hooks';
import { useAppSelector } from '@/redux/hooks';
import { NavigationAimKey, NavigationAnchorKey } from '@/util/keys';
import { hasInterestingTag, sgnUri } from '@/util/propertyTreeHelpers';
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
  const propertyOwners = useAppSelector((state) => state.propertyOwners.propertyOwners);

  const [anchor] = useGetStringPropertyValue(NavigationAnchorKey);
  const [aim] = useGetStringPropertyValue(NavigationAimKey);

  const featuredTreeData: SceneTreeNodeData[] = [];

  if (anchor) {
    const anchorData = treeDataForSceneGraphNode(sgnUri(anchor), propertyOwners);
    anchorData.label = 'Current Focus: ' + anchorData.label;
    featuredTreeData.push(anchorData);
  }

  if (aim) {
    const aimData = treeDataForSceneGraphNode(sgnUri(aim), propertyOwners);
    aimData.label = 'Current Aim: ' + aimData.label;
    featuredTreeData.push(aimData);
  }

  const interestingNodes: SceneTreeNodeData[] = [];
  const propertyOwnersScene = propertyOwners.Scene?.subowners ?? [];
  propertyOwnersScene.forEach((uri) => {
    if (hasInterestingTag(uri, propertyOwners)) {
      interestingNodes.push(treeDataForSceneGraphNode(uri, propertyOwners));
    }
  });

  if (interestingNodes.length > 0) {
    featuredTreeData.push({
      label: 'Quick Access',
      value: SceneTreeGroupPrefixKey + 'interesting',
      children: interestingNodes
    });
  }

  return (
    <Tree
      data={featuredTreeData}
      renderNode={(payload) => <SceneTreeNode {...payload} />}
    />
  );
}
