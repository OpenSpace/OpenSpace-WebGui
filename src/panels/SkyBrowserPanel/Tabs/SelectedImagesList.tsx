import { useAppSelector } from '@/redux/hooks';

import { SelectedImageCard } from './SelectedImageCard';
import { useOpenSpaceApi } from '@/api/hooks';
import { useSelectedBrowserProperty } from '../hooks';
import { DragDropList, OnDragEndProps } from '@/components/DragDropList/DragDropList';

export function SelectedImagesList() {
  const luaApi = useOpenSpaceApi();
  const browserId = useSelectedBrowserProperty('id');

  const imageList = useAppSelector((state) => state.skybrowser.imageList);
  const selectedImages = useAppSelector(
    (state) =>
      state.skybrowser.browsers[state.skybrowser.selectedBrowserId]?.selectedImages
  );
  const activeImage = useAppSelector((state) => state.skybrowser.activeImage);
  const opacities = useAppSelector(
    (state) => state.skybrowser.browsers[state.skybrowser.selectedBrowserId]?.opacities
  );

  async function onDragEnd({ newIndex, id }: OnDragEndProps<number>) {
    if (!browserId) {
      return;
    }
    // Call the scripting for the engine
    await luaApi?.skybrowser.setImageLayerOrder(browserId, id, newIndex);
  }

  return (
    imageList.length > 0 && (
      <DragDropList<number>
        onDragEnd={onDragEnd}
        id={'selectedImages'}
        renderFunc={(image, i) => (
          <SelectedImageCard
            key={imageList[image].url}
            image={imageList[image]}
            selected={activeImage === imageList[image].url}
            opacity={opacities[i]}
          />
        )}
        data={selectedImages}
        keyFunc={(item) => imageList[item].url}
      ></DragDropList>
    )
  );
}
