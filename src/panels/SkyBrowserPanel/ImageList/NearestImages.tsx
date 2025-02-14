import { Stack, Text } from '@mantine/core';

import { useAppSelector } from '@/redux/hooks';

import { useGetImagesInView } from './hooks';
import { ImageList } from './ImageList';
import { InfoGraphic } from './InfoGraphic';

function NoImagesDisplay() {
  return (
    <Stack h={'100%'}>
      <Text ta={'center'}>No images in view. Try moving the sky target!</Text>
      <InfoGraphic />
    </Stack>
  );
}

// This component has a hook which triggers renders very frequently so it is in
// it's own component to avoid the list being re-rendered unneccessarily
export function NearestImages() {
  const selectedBrowserId = useAppSelector((state) => state.skybrowser.selectedBrowserId);
  const imagesInView = useGetImagesInView(selectedBrowserId);
  return <ImageList imageList={imagesInView} noImagesDisplay={<NoImagesDisplay />} />;
}
