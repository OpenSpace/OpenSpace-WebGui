import { useTranslation } from 'react-i18next';
import { Stack, Text } from '@mantine/core';

import { useAppSelector } from '@/redux/hooks';

import { useImagesInView } from './hooks';
import { ImageList } from './ImageList';
import { InfoGraphic } from './InfoGraphic';

function NoImagesDisplay() {
  const { t } = useTranslation('panel-skybrowser', { keyPrefix: 'image-list' });

  return (
    <Stack h={'100%'}>
      <Text ta={'center'}>{t('no-images-in-view')}</Text>
      <InfoGraphic />
    </Stack>
  );
}

// This component has a hook which triggers renders very frequently so it is in
// it's own component to avoid the list being re-rendered unneccessarily
export function NearestImages() {
  const selectedBrowserId = useAppSelector((state) => state.skybrowser.selectedBrowserId);
  const imagesInView = useImagesInView(selectedBrowserId);
  return <ImageList imageList={imagesInView} noImagesDisplay={<NoImagesDisplay />} />;
}
