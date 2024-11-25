import { Divider, Tree, TreeNodeData } from '@mantine/core';

import { useAppSelector } from '@/redux/hooks';
import { hasInterestingTag, shouldShowPropertyOwner } from '@/util/propertytreehelper';
import { SceneTreeNode } from './SceneTreeNode';
import { NavigationAimKey, NavigationAnchorKey, ScenePrefixKey } from '@/util/keys';
import { useGetStringPropertyValue } from '@/api/hooks';
import { GroupPrefixKey, treeDataForPropertyOwner } from './treeUtil';
import { sortTreeData } from './sortingUtil';

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
  const sceneTreeData = useAppSelector((state) => state.groups.sceneTreeData);

  const customGuiOrdering = useAppSelector((state) => state.groups.customGroupOrdering);

  const anchor = useGetStringPropertyValue(NavigationAnchorKey);
  const aim = useGetStringPropertyValue(NavigationAimKey);

  function filterTreeData(nodes: TreeNodeData[]): TreeNodeData[] {
    return nodes
      .map((node) => {
        let newNode = { ...node };
        if (newNode.children && newNode.children.length > 0) {
          newNode.children = filterTreeData(newNode.children);
          if (newNode.children.length === 0) {
            return null;
          }

          if (newNode.value.startsWith(GroupPrefixKey)) {
            // Groups: Always show, if they have children
            return newNode;
          }
          else {
            // PropertyOwners, may be filtered out
            const shouldShow = shouldShowPropertyOwner(
              newNode.value,
              properties,
              showOnlyEnabled,
              showHiddenNodes
            );
            return shouldShow ? newNode : null;
          }
        }
        // Properties are returned as is. TODO: filter based on property visiblity setting
        return newNode;
      })
      .filter((node) => node !== null) as TreeNodeData[];
  }

  let treeData = filterTreeData(sceneTreeData);
  treeData = sortTreeData(treeData, customGuiOrdering, properties);

  // @TODO: make this a separate component, to avoid rerendering the entire tree when anchor changes
  // Quick access and current focus node
  let featuredTreeData: TreeNodeData[] = [];
  {
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

  // TODO: Filter the nodes and property owners based on visiblity
  // TODO: Remember which parts of the menu were open?

  return (
    <>
      {featuredTreeData.length > 0 && (
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
