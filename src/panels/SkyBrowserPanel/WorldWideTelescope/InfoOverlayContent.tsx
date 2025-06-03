import { useTranslation } from 'react-i18next';
import { Loader, Stack, Text } from '@mantine/core';

import { WwtStatus } from '../types';

interface Props {
  type: WwtStatus;
}

export function InfoOverlayContent({ type }: Props) {
  const { t } = useTranslation('panel-skybrowser', { keyPrefix: 'wwt.info-overlay' });

  if (type === 'LoadingWwt') {
    return (
      <Stack align={'center'}>
        <Text>{t('loading-wwt')}</Text>
        <Loader size={'lg'} type={'dots'} />
      </Stack>
    );
  }

  if (type === 'LoadingImageCollection') {
    return (
      <Stack align={'center'}>
        <Text>{t('loading-image-collection')}</Text>
        <Loader size={'lg'} type={'dots'} />
      </Stack>
    );
  }

  if (type === 'CameraNotInSolarSystem') {
    return (
      <Stack align={'center'} p={'lg'} ta={'center'}>
        <Text>{t('camera-not-in-solar-system.title')}</Text>
        <Text>{t('camera-not-in-solar-system.description')}</Text>
      </Stack>
    );
  }

  return <></>;
}
