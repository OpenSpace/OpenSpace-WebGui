import {
  ActionIcon,
  Checkbox,
  Group,
  Menu,
  ScrollArea,
  Tabs,
  Text,
  Tree,
  TreeNodeData
} from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';

import { CollapsableHeader } from '@/components/CollapsableHeader/CollapsableHeader';
import { LoadingBlocks } from '@/components/LoadingBlocks/LoadingBlocks';
import { PropertyOwner } from '@/components/PropertyOwner/PropertyOwner';
import { Tooltip } from '@/components/Tooltip/Tooltip';
import { FilterIcon } from '@/icons/icons';
import { useAppSelector } from '@/redux/hooks';
import { Groups } from '@/types/types';
import { hasInterestingTag, shouldShowPropertyOwner } from '@/util/propertytreehelper';

import { TempPropertyTest } from './TempPropertyTest';

export function Scene() {
  const propertyOwners = useAppSelector((state) => state.propertyOwners.propertyOwners);

  // TODO: Remove dependency on entire properties object. This means that the entire menu
  // is rerendered as soon as a property changes... Each propertyowner could handle its
  // visiblility instead?
  const properties = useAppSelector((state) => state.properties.properties);
  const hasLoadedScene = useAppSelector(
    (state) => Object.values(state.propertyOwners.propertyOwners)?.length > 0
  );

  const groups: Groups = useAppSelector((state) => state.groups.groups);
  // const customGuiGroupOrdering = useAppSelector(
  //   (state) => state.groups.customGroupOrdering
  // );

  // TODO: SHould this really be local storage?
  const [showOnlyEnabled, setShowOnlyEnabled] = useLocalStorage<boolean>({
    key: 'showOnlyEnabled',
    defaultValue: false
  });
  const [showHiddenNodes, setShowHiddenNodes] = useLocalStorage<boolean>({
    key: 'showHiddenNodes',
    defaultValue: false
  });

  const topLevelGroupsPaths = Object.keys(groups).filter((path) => {
    // Get the number of slashes in the path
    const depth = (path.match(/\//g) || []).length;
    return depth === 1 && path !== '/';
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
    const name = splitPath.length > 1 ? splitPath.pop() : 'Untitled';

    const groupItem: TreeNodeData = {
      value: path,
      label: name,
      children: []
    };

    const groupData = groups[path];

    // Add subgroups, recursively
    groupData.subgroups.forEach((subGroupPath) =>
      groupItem.children?.push(generateGroupData(subGroupPath))
    );

    // Add property owners
    groupData.propertyOwners
      .filter((uri) =>
        shouldShowPropertyOwner(uri, properties, showOnlyEnabled, showHiddenNodes)
      )
      .forEach((uri) => {
        const propertyOwner = propertyOwners[uri];
        groupItem.children?.push({
          value: uri, // TODO; what is this used for?
          label: propertyOwner?.name
        });
      });

    return groupItem;
  }

  const treeData: TreeNodeData[] = [];
  topLevelGroupsPaths.forEach((path) => {
    treeData.push(generateGroupData(path));
  });

  // Add the nodes without any group to the top level
  const nodesWithoutGroup = groups['/']?.propertyOwners || [];
  nodesWithoutGroup
    .filter((uri) =>
      shouldShowPropertyOwner(uri, properties, showOnlyEnabled, showHiddenNodes)
    )
    .forEach((uri) => {
      treeData.push({
        value: uri, // TODO; what is this used for?
        label: propertyOwners[uri]?.name
      });
    });

  return (
    <ScrollArea h={'100%'}>
      {!hasLoadedScene ? (
        <LoadingBlocks />
      ) : (
        <Tabs defaultValue={'propertyTest'}>
          <Tabs.List>
            <Tabs.Tab value={'propertyTest'}>Property test</Tabs.Tab>
            <Tabs.Tab value={'sceneMenu'}>Scene menu</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value={'propertyTest'}>
            <TempPropertyTest />
          </Tabs.Panel>

          <Tabs.Panel value={'sceneMenu'}>
            <Group justify={'space-between'}>
              <Text>Scene</Text>
              {/* TODO: Move this settings menu to a separate component */}
              <Menu position={'right-start'} closeOnItemClick={false}>
                <Menu.Target>
                  <ActionIcon>
                    <FilterIcon />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Group>
                    <Checkbox
                      label={'Show only visible'}
                      checked={showOnlyEnabled}
                      onChange={(event) =>
                        setShowOnlyEnabled(event.currentTarget.checked)
                      }
                    />
                    <Tooltip text={'Visible = Enabled and not faded out'} />
                  </Group>
                  <Group>
                    test {showOnlyEnabled}
                    <Checkbox
                      label={'Show objects with GUI hidden flag'}
                      checked={showHiddenNodes}
                      onChange={(event) =>
                        setShowHiddenNodes(event.currentTarget.checked)
                      }
                    />
                    <Tooltip
                      text={
                        'Show scene graph nodes that are marked as hidden in the GUI ' +
                        'part of the asset. These are otherwise hidden in the interface'
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
                  {hasChildren ? (
                    <CollapsableHeader
                      expanded={expanded}
                      text={
                        <Text fs={'italic'}>
                          {/* For now, render groups in italic to distiguish them from property owners*/}
                          {node.label}
                        </Text>
                      }
                    />
                  ) : (
                    <PropertyOwner uri={node.value} />
                  )}
                </div>
              )}
            />
          </Tabs.Panel>
        </Tabs>
      )}
    </ScrollArea>
  );
}
