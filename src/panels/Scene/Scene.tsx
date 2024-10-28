import { BiChevronRight } from 'react-icons/bi';
import { Box, Card, Collapse, Group, Skeleton, Space, Tabs, Text, Tree, TreeNodeData } from '@mantine/core';

import { CollapsibleHeader } from '@/components/CollapsibleHeader/CollapsibleHeader';
import { PropertyOwner } from '@/components/PropertyOwner/PropertyOwner';
import { Groups } from '@/redux/groups/groupsSlice';
import { useAppSelector } from '@/redux/hooks';
import { hasInterestingTag } from '@/util/propertytreehelper';

import { TempPropertyTest } from './TempPropertyTest';

export function Scene() {
  const propertyOwners = useAppSelector((state) => state.propertyTree.owners.propertyOwners);
  const hasLoadedScene = Object.keys(propertyOwners).length > 0;

  const groups: Groups = useAppSelector((state) => state.groups.groups);
  const customGuiGroupOrdering = useAppSelector((state) => state.groups.customGroupOrdering);

  const topLevelGroupsPaths = Object.keys(groups).filter((path) => {
    // Get the number of slashes in the path
    const depth = (path.match(/\//g) || []).length;
    return (depth === 1) && (path !== '/');
  });

  // TODO: Filter the nodes and property owners based on visiblity
  // TODO: Remember which parts of the menu were open?

  // Add featured/interesting nodes in a separate list
  const interestingNodes = [];
  const propertyOwnersScene = propertyOwners.Scene?.subowners ?? [];
  propertyOwnersScene.forEach((uri) => {
    if (hasInterestingTag(uri, propertyOwners)) {
      interestingNodes.push({
        key: uri,
        uri,
        expansionIdentifier: `scene-search/${uri}`
      });
    }
  });

  // Build the data structure for the tree
  function generateGroupData(path: string) {
    const splitPath = path.split('/');
    const name = (splitPath.length > 1) ? splitPath.pop() : 'Untitled';

    const groupItem: TreeNodeData = {
      value: path,
      label: name,
      children: []
    }

    const groupData = groups[path];

    // Add subgroups, recursively
    groupData.subgroups.forEach((subGroupPath) =>
      groupItem.children?.push(generateGroupData(subGroupPath))
    )

    // Add property owners
    groupData.propertyOwners.forEach((uri) => {
      const propertyOwner = propertyOwners[uri];
      groupItem.children?.push({
        value: uri, // TODO; what is this used for?
        label: propertyOwner?.name
      });
    })

    return groupItem;
  }

  const treeData: TreeNodeData[] = [];
  topLevelGroupsPaths.forEach(path => {
    treeData.push(generateGroupData(path));
  });

  // Add the nodes without any group to the top level
  const nodesWithoutGroup = groups['/']?.propertyOwners || [];
  nodesWithoutGroup.forEach((uri) => {
    const propertyOwner = propertyOwners[uri];
    treeData.push({
      value: uri, // TODO; what is this used for?
      label: propertyOwner?.name
    });
  })

  function loadingBlocks(n: number) {
    return [...Array(n)].map((_, i) =>
      <Skeleton key={i} height={8} width={`${Math.random() * 100}%`} radius="xl" />
    )
  }

  return (
    <>
      {!hasLoadedScene ?
        <>
          {loadingBlocks(4)}
        </>
        :
        <Tabs defaultValue="propertyTest">
          <Tabs.List>
            <Tabs.Tab value="propertyTest" >
              Property test
            </Tabs.Tab>
            <Tabs.Tab value="sceneMenu">
              Scene menu
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="propertyTest">
            <TempPropertyTest />
          </Tabs.Panel>

          <Tabs.Panel value="sceneMenu">
            <Group justify={'space-between'}>
              <Text>Scene</Text>
              {/* TODO: Move this settings menu to a separate component */}
              <Menu position={'right-start'} closeOnItemClick={false}>
                <Menu.Target>
                  <ActionIcon>
                    <MdFilterAlt />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Group>
                    <Checkbox
                      label="Show only visible"
                      checked={showOnlyEnabled}
                      onChange={(event) => setShowOnlyEnabled(event.currentTarget.checked)}
                    />
                    <Tooltip text="Visible = Enabled and not faded out" />
                  </Group>
                  <Group>
                    <Checkbox
                      label="Show objects with GUI hidden flag"
                      checked={showHiddenNodes}
                      onChange={(event) => setShowHiddenNodes(event.currentTarget.checked)}
                    />
                    <Tooltip
                      text={
                        "Show scene graph nodes that are marked as hidden in the GUI " +
                        "part of the asset. These are otherwise hidden in the interface"
                      }
                    />
                  </Group>
                </Menu.Dropdown>
              </Menu>
            </Group>
            <Tree
              data={treeData}
              renderNode={({ node, expanded, hasChildren, elementProps }) => (
                <div {...elementProps}>
                  {hasChildren ?
                    <CollapsibleHeader
                      expanded={expanded}
                      text={
                        <Text fs="italic">
                          {/* For now, render groups in italic to distiguish them from property owners*/}
                          {node.label}
                        </Text>
                      }
                    />
                    :
                    <PropertyOwner uri={node.value} />
                  }
                </div>
              )}
            />
          </Tabs.Panel >
        </Tabs>
      }
      <Space h="sm" />
    </>
  );
}
