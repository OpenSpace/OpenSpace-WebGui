import { Loader, Stack, Text } from '@mantine/core';

import { useAppSelector } from '@/redux/hooks';

import { useWwtProvider } from './WwtProvider/hooks';

export function InfoOverlayContent() {
  const cameraInSolarSystem = useAppSelector(
    (state) => state.skybrowser.cameraInSolarSystem
  );
  const { imageCollectionLoaded, wwtHasLoaded } = useWwtProvider();

  if (!wwtHasLoaded || !imageCollectionLoaded) {
    return (
      <Stack align={'center'}>
        {!wwtHasLoaded && <Text>Loading WorldWide Telescope...</Text>}
        {wwtHasLoaded && !imageCollectionLoaded && (
          <Text>Loading image collection...</Text>
        )}
        <Loader size={'lg'} type={'dots'} />
      </Stack>
    );
  }

  if (!cameraInSolarSystem) {
    return (
      <Stack align={'center'} p={'lg'} ta={'center'}>
        <Text>Camera is not in solar system.</Text>
        <Text>You need to be in the solar system to use the SkyBrowser.</Text>
      </Stack>
    );
  }

  return <></>;
}
