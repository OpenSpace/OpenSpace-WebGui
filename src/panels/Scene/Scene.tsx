import { Box, Container, Divider } from '@mantine/core';

import { useComputeHeightFunction } from '@/components/FilterList/hooks';
import { LoadingBlocks } from '@/components/LoadingBlocks/LoadingBlocks';
import { SceneTree } from '@/panels/Scene/SceneTree/SceneTree';
import { useAppSelector } from '@/redux/hooks';

import { FeaturedSceneTree } from './SceneTree/FeaturedSceneTree';

export function Scene() {
  const hasLoadedScene = useAppSelector(
    (state) => Object.keys(state.propertyOwners.propertyOwners).length > 0
  );

  const { ref, heightFunction } = useComputeHeightFunction(100, 10);

  if (!hasLoadedScene) {
    return (
      <Container mt={'md'}>
        <LoadingBlocks />
      </Container>
    );
  }

  return (
    <Container>
      <Box ref={ref}>
        <FeaturedSceneTree />
        <Divider my={'xs'} />
      </Box>
      <SceneTree heightFunction={heightFunction} />
    </Container>
  );
}
