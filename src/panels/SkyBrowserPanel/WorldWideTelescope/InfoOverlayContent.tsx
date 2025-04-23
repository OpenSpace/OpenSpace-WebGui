import { Loader, Stack, Text } from '@mantine/core';

import { WwtStatus } from '../types';

interface Props {
  type: WwtStatus;
}

export function InfoOverlayContent({ type }: Props) {
  if (type === 'LoadingWwt') {
    return (
      <Stack align={'center'}>
        <Text>Loading WorldWide Telescope...</Text>
        <Loader size={'lg'} type={'dots'} />
      </Stack>
    );
  }

  if (type === 'LoadingImageCollection') {
    return (
      <Stack align={'center'}>
        <Text>Loading image collection...</Text>
        <Loader size={'lg'} type={'dots'} />
      </Stack>
    );
  }

  if (type === 'CameraNotInSolarSystem') {
    return (
      <Stack align={'center'} p={'lg'} ta={'center'}>
        <Text>Camera is not in solar system.</Text>
        <Text>You need to be in the solar system to use the SkyBrowser.</Text>
      </Stack>
    );
  }

  return <></>;
}
