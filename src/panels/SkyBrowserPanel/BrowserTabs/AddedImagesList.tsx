import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Box } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import {
  DragReorderList,
  OnDragEndProps
} from '@/components/DragReorderList/DragReorderList';
import { LoadingBlocks } from '@/components/LoadingBlocks/LoadingBlocks';
import { useAppSelector } from '@/redux/hooks';

import { useOpacities, useSelectedImages } from '../hooks';

import { AddedImageCard } from './AddedImageCard';

interface Props {
  id: string;
}

export function AddedImagesList({ id }: Props) {
  const luaApi = useOpenSpaceApi();
  const browserId = useAppSelector((state) => {
    return state.skybrowser.selectedBrowserId;
  });

  const imageList = useAppSelector((state) => state.skybrowser.imageList);
  const selectedImages = useSelectedImages(id);
  const opacities = useOpacities(id);
  const activeImage = useAppSelector((state) => state.skybrowser.activeImage);
  const { t } = useTranslation('panel-skybrowser', {
    keyPrefix: 'browser-tabs.added-image-list'
  });

  const onDragEnd = useCallback(
    async ({ newIndex, id }: OnDragEndProps<number>) => {
      await luaApi?.skybrowser.setImageLayerOrder(browserId, id, newIndex);
    },
    [luaApi, browserId]
  );

  const renderFunc = useCallback(
    (image: number, i: number) => {
      if (!opacities || !imageList) {
        return <></>;
      }
      return (
        <AddedImageCard
          key={imageList[image].url}
          image={imageList[image]}
          selected={activeImage === imageList[image].url}
          opacity={opacities[i]}
        />
      );
    },
    [imageList, opacities, activeImage]
  );

  const keyFunc = useCallback((item: number) => imageList![item].url, [imageList]);

  if (!imageList || !selectedImages || !opacities) {
    return <LoadingBlocks mt={'md'} />;
  }

  return (
    <Box my={'md'}>
      {selectedImages.length === 0 && t('no-images')}
      <DragReorderList<number>
        onDragEnd={onDragEnd}
        id={'selectedImages'}
        renderFunc={renderFunc}
        data={selectedImages}
        keyFunc={keyFunc}
        gap={15}
      />
    </Box>
  );
}
