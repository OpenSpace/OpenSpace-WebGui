import { useAppSelector } from '@/redux/hooks';

import { SelectedImageCard } from './SelectedImageCard';

export function SelectedImagesList() {
  const imageList = useAppSelector((state) => state.skybrowser.imageList);
  const selectedImages = useAppSelector(
    (state) =>
      state.skybrowser.browsers[state.skybrowser.selectedBrowserId]?.selectedImages
  );
  const activeImage = useAppSelector((state) => state.skybrowser.activeImage);
  const opacities = useAppSelector(
    (state) => state.skybrowser.browsers[state.skybrowser.selectedBrowserId]?.opacities
  );
  return (
    <>
      {selectedImages?.map((image, i) => {
        return (
          imageList[image] && (
            <SelectedImageCard
              key={imageList[image].url}
              image={imageList[image]}
              selected={activeImage === imageList[image].url}
              opacity={opacities[i]}
            />
          )
        );
      })}
    </>
  );
}
