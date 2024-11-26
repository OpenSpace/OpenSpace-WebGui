import { Divider, Tree, TreeNodeData } from '@mantine/core';

import { useAppSelector } from '@/redux/hooks';
import { hasInterestingTag } from '@/util/propertytreehelper';
import { SceneTreeNode } from './SceneTreeNode';
import { NavigationAimKey, NavigationAnchorKey, ScenePrefixKey } from '@/util/keys';
import { useGetStringPropertyValue } from '@/api/hooks';
import { filterTreeData, GroupPrefixKey } from './treeUtil';
import { treeDataForPropertyOwner } from '@/redux/groups/groupsSlice';

interface Props {
  showOnlyEnabled?: boolean;
  showHiddenNodes?: boolean;
}

/**
 * This component displays the current focus and aim of the camera, as well as the list of
 * nodes makred as interesting.
 */
export function FeaturedSceneTree({
  showOnlyEnabled = false,
  showHiddenNodes = false
}: Props) {
  const propertyOwners = useAppSelector((state) => state.propertyOwners.propertyOwners);

  // TODO: Remove dependency on entire properties object. This means that the entire menu
  // is rerendered as soon as a property changes...
  const properties = useAppSelector((state) => state.properties.properties);

  const anchor = useGetStringPropertyValue(NavigationAnchorKey);
  const aim = useGetStringPropertyValue(NavigationAimKey);

  let featuredTreeData: TreeNodeData[] = [];

  if (anchor) {
    const anchorData = treeDataForPropertyOwner(
      ScenePrefixKey + anchor,
      propertyOwners
    );
    anchorData.label = 'Current Focus: ' + anchorData.label;
    featuredTreeData.push(anchorData);
  }

  if (aim) {
    const aimData = treeDataForPropertyOwner(ScenePrefixKey + aim, propertyOwners);
    aimData.label = 'Current Aim: ' + aimData.label;
    featuredTreeData.push(aimData);
  }

  let interestingNodes: TreeNodeData = {
    label: 'Quick Access',
    value: GroupPrefixKey + 'interesting',
    children: []
  };

  const propertyOwnersScene = propertyOwners.Scene?.subowners ?? [];
  propertyOwnersScene.forEach((uri) => {
    if (hasInterestingTag(uri, propertyOwners)) {
      interestingNodes.children?.push(
        treeDataForPropertyOwner(uri, propertyOwners)
      );
    }
  });

  if (interestingNodes.children && interestingNodes.children.length > 0) {
    interestingNodes.children = filterTreeData(
      interestingNodes.children,
      showOnlyEnabled,
      showHiddenNodes,
      properties
    );
    featuredTreeData.push(interestingNodes);
  }

  if (featuredTreeData.length === 0) {
    return null;
  }

  return (
    <>
      <Tree
        data={featuredTreeData}
        renderNode={(payload) => <SceneTreeNode {...payload} />}
      />
      <Divider my={'xs'} />
    </>
  )
}
