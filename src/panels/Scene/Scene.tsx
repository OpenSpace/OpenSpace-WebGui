import { Container, Tabs, Title } from '@mantine/core';

import { LoadingBlocks } from '@/components/LoadingBlocks/LoadingBlocks';
import { SceneTree } from '@/panels/Scene/SceneTree/SceneTree';
import { useAppSelector } from '@/redux/hooks';

import { FeaturedSceneTree } from './SceneTree/FeaturedSceneTree';
import { TempPropertyTest } from './TempPropertyTest';

export function Scene() {
  const hasLoadedScene = useAppSelector(
    (state) => Object.keys(state.propertyOwners.propertyOwners).length > 0
  );

  if (!hasLoadedScene) {
    return (
      <Container mt={'md'}>
        <LoadingBlocks />
      </Container>
    );
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
          <Title order={2}>Scene</Title>
          <FeaturedSceneTree />
          <SceneTree />
        </Container>
      </Tabs.Panel>
    </Tabs>
  );
}
