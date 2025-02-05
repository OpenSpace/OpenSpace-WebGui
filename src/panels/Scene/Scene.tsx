import { Box, Container, Divider, ScrollArea } from '@mantine/core';

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
    <ScrollArea h={'100%'}>
      <Box p={'xs'}>
        <FeaturedSceneTree />
        <Divider mt={'xs'} mb={'xs'} />
        <SceneTree />
      </Box>
    </ScrollArea>
  );
}
