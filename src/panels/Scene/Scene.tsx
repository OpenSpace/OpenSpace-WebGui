import { Container, Divider } from '@mantine/core';

import { Layout } from '@/components/Layout/Layout';
import { LoadingBlocks } from '@/components/LoadingBlocks/LoadingBlocks';
import { SceneTree } from '@/panels/Scene/SceneTree/SceneTree';
import { useAppSelector } from '@/redux/hooks';

import { FeaturedSceneTree } from './SceneTree/FeaturedSceneTree';

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
    <Layout>
      <Layout.FixedSection>
        <FeaturedSceneTree />
        <Divider mt={'lg'} />
      </Layout.FixedSection>
      <Layout.GrowingSection pt={'md'}>
        <SceneTree />
      </Layout.GrowingSection>
    </Layout>
  );
}
