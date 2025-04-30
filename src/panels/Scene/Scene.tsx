import { Divider } from '@mantine/core';

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
    return <LoadingBlocks />;
  }

  return (
    <Layout>
      <Layout.FixedSection>
        <FeaturedSceneTree />
        <Divider mt={5} />
      </Layout.FixedSection>
      <Layout.GrowingSection pt={'xs'}>
        <SceneTree />
      </Layout.GrowingSection>
    </Layout>
  );
}
