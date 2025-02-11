import { useCallback } from 'react';
import { Box } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import {
  DragReorderList,
  OnDragEndProps
} from '@/components/DragReorderList/DragReorderList';
import { useAppSelector } from '@/redux/hooks';

import { useSkyBrowserSelectedImages, useSkyBrowserSelectedOpacities } from '../hooks';

import { AddedImageCard } from './AddedImageCard';

export function AddedImagesList() {
  const luaApi = useOpenSpaceApi();
  const browserId = useAppSelector((state) => {
    return state.skybrowser.selectedBrowserId;
  });

  const imageList = useAppSelector((state) => state.skybrowser.imageList);
  const selectedImages = useSkyBrowserSelectedImages();
  const opacities = useSkyBrowserSelectedOpacities();
  const activeImage = useAppSelector((state) => state.skybrowser.activeImage);

  const onDragEnd = useCallback(
    async ({ newIndex, id }: OnDragEndProps<number>) => {
      await luaApi?.skybrowser.setImageLayerOrder(browserId, id, newIndex);
    },
    [luaApi, browserId]
  );

  const renderFunc = useCallback(
    (image: number, i: number) => {
      if (opacities === undefined) {
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

  const keyFunc = useCallback((item: number) => imageList[item].url, [imageList]);

  if (imageList.length === 0 || selectedImages === undefined || opacities === undefined) {
    return <></>;
  }

  return (
    <Box my={'md'}>
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
