import { useGetImagesInView } from './hooks';
import { ImageList } from './ImageList';

// This component has a hook which triggers renders very frequently
// so it is in it's own component to avoid the list being re-rendered
// unneccessarily
export function NearestImages() {
  const imagesInView = useGetImagesInView();
  return <ImageList imageList={imagesInView} noImagesText="No images in view" />;
}
