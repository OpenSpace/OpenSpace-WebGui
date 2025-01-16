import { useAppSelector } from '@/redux/hooks';
import { SelectedImageCard } from './SelectedImageCard';

export function SelectedImagesList() {
  const imageList = useAppSelector((state) => state.skybrowser.imageList);
  const selectedImages = useAppSelector(
    (state) =>
      state.skybrowser.browsers[state.skybrowser.selectedBrowserId]?.selectedImages
  );
  return (
    <>
      {selectedImages?.map((image, i) => {
        return (
          image &&
          imageList[image] && (
            <SelectedImageCard
              key={imageList[image].url}
              image={imageList[image]}
              selected={i % 3 === 0}
            />
          )
        );
      })}
    </>
  );
}
