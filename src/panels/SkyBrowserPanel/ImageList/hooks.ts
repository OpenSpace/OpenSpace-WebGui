import { useAppSelector } from '@/redux/hooks';

import { DistanceSortThreshold, euclidianDistance, isWithinFOV } from './util';
import {
  useSelectedBrowserCoords,
  useSelectedBrowserFov,
  useSkyBrowserCartesianDirection
} from '../hooks';

export function useGetImagesInView() {
  const { ra, dec } = useSelectedBrowserCoords();
  const fov = useSelectedBrowserFov();
  const cartesianDirection = useSkyBrowserCartesianDirection();
  const imageList = useAppSelector((state) => state.skybrowser.imageList);

  if (
    !cartesianDirection ||
    !imageList ||
    ra === undefined ||
    fov === undefined ||
    dec === undefined
  ) {
    return [];
  }

  const searchRadius = fov / 2;

  // Only load images that have coordinates within current window
  const imgsWithinTarget = imageList.filter((img) => {
    if (!img.hasCelestialCoords) {
      return false; // skip
    }
    return (
      isWithinFOV(img.ra, ra, searchRadius) && isWithinFOV(img.dec, dec, searchRadius)
    );
  });

  imgsWithinTarget.sort((a, b) => {
    const distA = euclidianDistance(a.cartesianDirection, cartesianDirection);
    const distB = euclidianDistance(b.cartesianDirection, cartesianDirection);
    let result = distA > distB;
    // If both the images are within a certain distance of each other
    // assume they are taken of the same object and sort on fov.
    if (
      euclidianDistance(a.cartesianDirection, cartesianDirection) <
        DistanceSortThreshold &&
      euclidianDistance(b.cartesianDirection, cartesianDirection) < DistanceSortThreshold
    ) {
      result = a.fov > b.fov;
    }
    return result ? 1 : -1;
  });

  return imgsWithinTarget;
}
