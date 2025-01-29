import { useAppSelector } from '@/redux/hooks';

import { SelectedImageCard } from './SelectedImageCard';
import { useOpenSpaceApi } from '@/api/hooks';
import { useSkyBrowserSelectedImages, useSkyBrowserSelectedOpacities } from '../hooks';
import { DragDropList, OnDragEndProps } from '@/components/DragDropList/DragDropList';
import { useCallback } from 'react';

export function SelectedImagesList() {
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
      if (!browserId) {
        return;
      }
      // Call the scripting for the engine
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
        <SelectedImageCard
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
    <DragDropList<number>
      onDragEnd={onDragEnd}
      id={'selectedImages'}
      renderFunc={renderFunc}
      data={selectedImages}
      keyFunc={keyFunc}
    ></DragDropList>
  );
}
