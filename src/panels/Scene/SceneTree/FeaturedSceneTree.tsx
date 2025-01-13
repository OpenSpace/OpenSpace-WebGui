import { Divider, Tree, TreeNodeData } from '@mantine/core';

import { useGetStringPropertyValue } from '@/api/hooks';
import { useAppSelector } from '@/redux/hooks';
import { NavigationAimKey, NavigationAnchorKey } from '@/util/keys';
import { hasInterestingTag, sgnUri } from '@/util/propertyTreeHelpers';
import {
  SceneTreeGroupPrefixKey,
  treeDataForSceneGraphNode
} from '@/util/sceneTreeGroupsHelper';

import { SceneTreeNodeStyled } from './SceneTreeNode';
import { filterTreeData, SceneTreeFilterSettings } from './treeUtil';

interface Props {
  filter: SceneTreeFilterSettings;
}

/**
 * This component displays the current focus and aim of the camera, as well as the list of
 * nodes marked as interesting.
 */
export function FeaturedSceneTree({ filter }: Props) {
  const propertyOwners = useAppSelector((state) => state.propertyOwners.propertyOwners);

  // TODO: Remove dependency on entire properties object. This means that the entire menu
  // is rerendered as soon as a property changes...
  const properties = useAppSelector((state) => state.properties.properties);

  const [anchor] = useGetStringPropertyValue(NavigationAnchorKey);
  const [aim] = useGetStringPropertyValue(NavigationAimKey);

  const featuredTreeData: TreeNodeData[] = [];

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

  const interestingNodes: TreeNodeData = {
    label: 'Quick Access',
    value: SceneTreeGroupPrefixKey + 'interesting',
    children: []
  };

  const propertyOwnersScene = propertyOwners.Scene?.subowners ?? [];
  propertyOwnersScene.forEach((uri) => {
    if (hasInterestingTag(uri, propertyOwners)) {
      interestingNodes.children?.push(treeDataForSceneGraphNode(uri, propertyOwners));
    }
  });

  if (interestingNodes.children && interestingNodes.children.length > 0) {
    interestingNodes.children = filterTreeData(
      interestingNodes.children,
      filter,
      properties,
      propertyOwners
    );
    featuredTreeData.push(interestingNodes);
  }

  if (featuredTreeData.length === 0) {
    return <></>;
  }

  return (
    <>
      <Tree
        data={featuredTreeData}
        renderNode={(payload) => <SceneTreeNodeStyled {...payload} />}
      />
      <Divider my={'xs'} />
    </>
  );
}
