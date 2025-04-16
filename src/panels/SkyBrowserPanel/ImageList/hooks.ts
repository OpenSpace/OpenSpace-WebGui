import { useAppSelector } from '@/redux/hooks';

import { useBrowserCoords, useBrowserFov, useCartesianDirection } from '../hooks';

import { DistanceSortThreshold, euclidianDistance, isWithinFOV } from './util';

export function useImagesInView(id: string) {
  const { ra, dec } = useBrowserCoords(id);
  const fov = useBrowserFov(id);
  const viewDirection = useCartesianDirection(id);
  const imageList = useAppSelector((state) => state.skybrowser.imageList);

  if (
    !viewDirection ||
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

  imgsWithinTarget.sort((imgA, imgB) => {
    // Get the distance from the image to the center of the view
    const distA = euclidianDistance(imgA.cartesianDirection, viewDirection);
    const distB = euclidianDistance(imgB.cartesianDirection, viewDirection);

    // If both the images are within a certain distance of each other
    // assume they are taken of the same object and sort by fov.
    // This is because it is nice to have an overview of the object before getting
    // the details
    const isSameObject = distA < DistanceSortThreshold && distB < DistanceSortThreshold;
    if (isSameObject) {
      return imgA.fov > imgB.fov ? 1 : -1;
    }
    // Else sort by distance
    return distA > distB ? 1 : -1;
  });

  return imgsWithinTarget;
}
