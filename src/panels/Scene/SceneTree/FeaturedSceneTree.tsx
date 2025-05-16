import { useTranslation } from 'react-i18next';
import { Tree } from '@mantine/core';

import { useAimNode, useAnchorNode, useFeaturedNodes } from '@/util/propertyTreeHooks';

import { SceneTreeNode } from './SceneTreeNode';
import { SceneTreeGroupPrefixKey, treeDataForSceneGraphNode } from './treeUtils';
import { SceneTreeNodeData } from './types';

/**
 * This component displays the current focus and aim of the camera, as well as the list of
 * nodes marked as interesting.
 */
export function FeaturedSceneTree() {
  const { t } = useTranslation('panel-scene', {
    keyPrefix: 'scene-tree.featured-scene-tree'
  });
  const featuredNodes = useFeaturedNodes();
  const anchorNode = useAnchorNode();
  const aimNode = useAimNode();

  const featuredTreeData: SceneTreeNodeData[] = [];

  if (anchorNode) {
    const anchorData = treeDataForSceneGraphNode(anchorNode.name, anchorNode.uri);
    anchorData.label = t('current-focus-label', { name: anchorNode.name });
    featuredTreeData.push(anchorData);
  }

  if (aimNode) {
    const aimData = treeDataForSceneGraphNode(aimNode.name, aimNode.uri);
    aimData.label = t('current-aim-label', { name: aimNode.name });
    featuredTreeData.push(aimData);
  }

  if (featuredNodes.length > 0) {
    featuredTreeData.push({
      label: t('quick-access-label'),
      value: SceneTreeGroupPrefixKey + 'interesting',
      children: featuredNodes.map((owner) =>
        treeDataForSceneGraphNode(owner.name, owner.uri)
      )
    });
  }

  return (
    <Tree
      data={featuredTreeData}
      renderNode={({ node, expanded, elementProps, tree }) => (
        <SceneTreeNode
          node={node}
          expanded={expanded}
          elementProps={elementProps}
          tree={tree}
        />
      )}
    />
  );
}
