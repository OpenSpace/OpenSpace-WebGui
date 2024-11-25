import { Divider, Tree, TreeNodeData } from '@mantine/core';

import { Groups } from '@/redux/groups/groupsSlice';
import { useAppSelector } from '@/redux/hooks';
import { hasInterestingTag, shouldShowPropertyOwner } from '@/util/propertytreehelper';
import { SceneTreeNode } from './SceneTreeNode';
import { NavigationAimKey, NavigationAnchorKey, ScenePrefixKey } from '@/util/keys';
import { useGetStringPropertyValue } from '@/api/hooks';
import { GroupPrefixKey, treeDataForPropertyOwner, treeDataFromGroups } from './treeUtil';

interface Props {
  propertyOwnerUri?: string;
  showOnlyEnabled?: boolean;
  showHiddenNodes?: boolean;
}

/**
 * This component displays a tree of the scene graph, either starting from a certain
 * property owner, or the entire tree.
 */
export function SceneTree({
  showOnlyEnabled = false,
  showHiddenNodes = false
}: Props) {
  const propertyOwners = useAppSelector((state) => state.propertyOwners.propertyOwners);

  // TODO: Remove dependency on entire properties object. This means that the entire menu
  // is rerendered as soon as a property changes...
  const properties = useAppSelector((state) => state.properties.properties);
  const groups: Groups = useAppSelector((state) => state.groups.groups);

  const anchor = useGetStringPropertyValue(NavigationAnchorKey);
  const aim = useGetStringPropertyValue(NavigationAimKey);

  function hidePropertyOwner(uri: string) {
    return !shouldShowPropertyOwner(uri, properties, showOnlyEnabled, showHiddenNodes);
  }

  function filterTreeData(nodes: TreeNodeData[]): TreeNodeData[] {
    return nodes
      .map((node) => {
        if (node.children && node.children.length > 0) {
          node.children = filterTreeData(node.children);
          if (node.children.length === 0) {
            return null;
          }

          if (node.value.startsWith(GroupPrefixKey)) {
            // Groups: Always show, if they have children
            return node;
          }
          else {
            // PropertyOwners
            return !hidePropertyOwner(node.value) ? node : null;
          }
        }
        // Properties
        return node;
      })
      .filter((node) => node !== null) as TreeNodeData[];
  }

  let treeData: TreeNodeData[] = [];
  let featuredTreeData: TreeNodeData[] | undefined = undefined;

  // Quick access and current focus node
  {
    featuredTreeData = [];

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
        interestingNodes.children
      );
      featuredTreeData.push(interestingNodes);
    }
  }

  treeData = treeDataFromGroups(groups, propertyOwners);
  treeData = filterTreeData(treeData);


  return (
    <>
      {featuredTreeData && (
        <>
          <Tree
            data={featuredTreeData}
            renderNode={(payload) => <SceneTreeNode {...payload} />}
          />
          <Divider my={'xs'} />
        </>
      )}
      <Tree
        data={treeData}
        renderNode={(payload) => <SceneTreeNode {...payload} />}
      />
    </>
  );
}
