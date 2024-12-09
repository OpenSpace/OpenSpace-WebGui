import { useState } from 'react';
import {
  ActionIcon,
  Checkbox,
  Container,
  Group,
  Menu,
  MultiSelect,
  Skeleton,
  Stack,
  Tabs,
  Title
} from '@mantine/core';

import { Tooltip } from '@/components/Tooltip/Tooltip';
import { FilterIcon } from '@/icons/icons';
import { SceneTree } from '@/panels/Scene/SceneTree/SceneTree';
import { useAppSelector } from '@/redux/hooks';

import { TempPropertyTest } from './TempPropertyTest';

export function Scene() {
  const hasLoadedScene = useAppSelector(
    (state) => Object.values(state.propertyOwners.propertyOwners)?.length > 0
  );

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const tags = useAppSelector((state) => state.groups.tags);
  const sortedTags = Array.from(tags).sort();

  const [showOnlyVisible, setshowOnlyVisible] = useState(false);
  const [showHiddenNodes, setShowHiddenNodes] = useState(false);

  function loadingBlocks(n: number, minWidthPercentage: number = 0) {
    const min = minWidthPercentage;
    return (
      <Stack>
        {[...Array(n)].map((_, i) => (
          <Skeleton
            key={i}
            height={10}
            width={`${min + Math.random() * 100 * (1.0 - min / 100.0)}%`}
          />
        ))}
      </Stack>
    );
  }

  if (!hasLoadedScene) {
    return <Container mt={'md'}>{loadingBlocks(4, 20)}</Container>;
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
        <Container>
          <Group justify={'space-between'}>
            <Title order={2}>Scene</Title>
            {/* TODO: Move this settings menu to a separate component */}
            <Menu position={'right-start'} closeOnItemClick={false}>
              <Menu.Target>
                <ActionIcon>
                  <FilterIcon />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown maw={'300px'}>
                <Group>
                  <Checkbox
                    label={'Show only visible'}
                    checked={showOnlyVisible}
                    onChange={(event) => setshowOnlyVisible(event.currentTarget.checked)}
                  />
                  <Tooltip text={'Visible = Enabled and not faded out'} />
                </Group>
                <Group>
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
                <Title order={3}>Tags</Title>
                <MultiSelect
                  data={sortedTags}
                  value={selectedTags}
                  onChange={setSelectedTags}
                  clearable
                  searchable
                />
              </Menu.Dropdown>
            </Menu>
          </Group>
          <SceneTree
            filter={{
              showOnlyVisible,
              showHiddenNodes,
              tags: selectedTags
            }}
          />
        </Container>
      </Tabs.Panel>
    </Tabs>
  );
}
