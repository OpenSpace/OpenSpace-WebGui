import { useGetImagesInView } from './hooks';
import { ImageList } from './ImageList';

interface Props {
  columns: number;
}
// This component has a hook which triggers renders very frequently
// so it is in it's own component to avoid the list being re-rendered
// unneccessarily
export function NearestImages({ columns }: Props) {
  const imagesInView = useGetImagesInView();
  return (
    <ImageList
      imageList={imagesInView}
      columns={columns}
      noImagesText={'No images in view'}
    />
  );
}
