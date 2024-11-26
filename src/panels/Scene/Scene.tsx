import { useState } from 'react';
import { ActionIcon, Checkbox, Group, Menu, Skeleton, Tabs, Text } from '@mantine/core';

import { Tooltip } from '@/components/Tooltip/Tooltip';
import { FilterIcon } from '@/icons/icons';
import { SceneTree } from '@/panels/Scene/SceneTree/SceneTree';
import { useAppSelector } from '@/redux/hooks';

import { TempPropertyTest } from './TempPropertyTest';

export function Scene() {
  const hasLoadedScene = useAppSelector(
    (state) => Object.values(state.propertyOwners.propertyOwners)?.length > 0
  );

  const [showOnlyEnabled, setShowOnlyEnabled] = useState(false);
  const [showHiddenNodes, setShowHiddenNodes] = useState(false);

  function loadingBlocks(n: number) {
    return [...Array(n)].map((_, i) => (
      <Skeleton key={i} height={8} width={`${Math.random() * 100}%`} radius={'xl'} />
    ));
  }

  if (!hasLoadedScene) {
    return <>{loadingBlocks(4)}</>;
  }

  return (
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
                  onChange={(event) => setShowOnlyEnabled(event.currentTarget.checked)}
                />
                <Tooltip text={'Visible = Enabled and not faded out'} />
              </Group>
              <Group>
                {showOnlyEnabled}
                <Checkbox
                  label={'Show objects with GUI hidden flag'}
                  checked={showHiddenNodes}
                  onChange={(event) => setShowHiddenNodes(event.currentTarget.checked)}
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
        <SceneTree showOnlyEnabled={showOnlyEnabled} showHiddenNodes={showHiddenNodes} />
      </Tabs.Panel>
    </Tabs>
  );
}
