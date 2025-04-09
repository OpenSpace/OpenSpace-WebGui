import { useAppSelector } from '@/redux/hooks';
import { Stack, Loader, Text } from '@mantine/core';
import { useWwtProvider } from './WwtProvider/hooks';

export function Overlay() {
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
      <Stack align={'center'} p={'lg'}>
        <Text>Camera is not in solar system.</Text>
        <Text ta={'center'}>
          You need to be in the solar system to use the SkyBrowser.
        </Text>
      </Stack>
    );
  }

  return <></>;
}
