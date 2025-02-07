import { useEffect } from 'react';

import { useAppSelector } from '@/redux/hooks';
import { useWindowSize } from '@/windowmanagement/Window/hooks';

import {
  useSelectedBrowserColor,
  useSelectedBrowserCoords,
  useSelectedBrowserFov,
  useSelectedBrowserRadius,
  useSkyBrowserSelectedImages,
  useSkyBrowserSelectedOpacities
} from '../hooks';

import { useWwtProvider } from './WwtProvider/hooks';

// These are the hooks that will keep track of the redux state and
// when it changes, it will pass along these messages to WWT

// Whenever a redux state change of the selected images is detected,
// pass messages to WWT to reflect this change.
// This adding and removal of images will be brute forced; i.e. every
// time an image is added or removed, all previously added images will be
// removed and then the new array of images is added. This is because the
// performance loss is negligible and there are many complicated cases to keep track of.
export function useUpdateSelectedImages() {
  const { imageCollectionLoaded, loadImage, removeImage } = useWwtProvider();
  const imageList = useAppSelector((state) => state.skybrowser.imageList);
  const selectedImages = useSkyBrowserSelectedImages();

  useEffect(() => {
    const isDataLoaded = imageList.length !== 0 && selectedImages !== undefined;
    if (!isDataLoaded || !imageCollectionLoaded) {
      return;
    }

    selectedImages.toReversed().map((index) => {
      loadImage(imageList[index]?.url);
    });
    return () => selectedImages?.forEach((image) => removeImage(imageList[image].url));
  }, [imageList, selectedImages, imageCollectionLoaded, loadImage, removeImage]);
}

// Whenever a redux state change of the selected image opacities is detected,
// pass messages to WWT to reflect this change.
// We don't try to be clever here and only set the opacity that has changed;
// instead we pass messages for all the opacities whenever we detect a change.
// This because this is much easier - the performance loss is negligible and
// there are many complicated cases.
export function useUpdateOpacities() {
  const { imageCollectionLoaded, setOpacity } = useWwtProvider();
  const imageList = useAppSelector((state) => state.skybrowser.imageList);
  const selectedImages = useSkyBrowserSelectedImages();
  const opacities = useSkyBrowserSelectedOpacities();

  useEffect(() => {
    const isWwtReady = imageList.length !== 0 && imageCollectionLoaded;
    const isBrowserDataLoaded = opacities !== undefined && selectedImages !== undefined;
    if (!isWwtReady || !isBrowserDataLoaded) {
      return;
    }
    opacities.map((opacity, i) => {
      const { url } = imageList[selectedImages[i]];
      setOpacity(url, opacity);
    });
  }, [imageList, selectedImages, opacities, imageCollectionLoaded, setOpacity]);
}

// Whenever a redux state change of the aim is detected,
// pass messages to WWT to reflect this change
export function useUpdateAim() {
  const { ra, dec, roll } = useSelectedBrowserCoords();
  const fov = useSelectedBrowserFov();
  const { setAim } = useWwtProvider();

  useEffect(() => {
    setAim(ra, dec, fov, roll);
  }, [ra, dec, fov, roll, setAim]);
}

// Whenever a redux state change of the border color is detected,
// pass messages to WWT to reflect this change
export function useUpdateBorderColor() {
  const borderColor = useSelectedBrowserColor();
  const { wwtHasLoaded, setBorderColor } = useWwtProvider();

  useEffect(() => {
    if (borderColor && wwtHasLoaded) {
      setBorderColor(borderColor);
    }
  }, [borderColor, wwtHasLoaded, setBorderColor]);
}

// Whenever a redux state change of the border radius is detected,
// pass messages to WWT to reflect this change
export function useUpdateBorderRadius() {
  const borderRadius = useSelectedBrowserRadius();
  const { setBorderRadius, wwtHasLoaded } = useWwtProvider();
  const { width, height } = useWindowSize();

  useEffect(() => {
    if (borderRadius && wwtHasLoaded) {
      setBorderRadius(borderRadius);
    }
  }, [borderRadius, setBorderRadius, wwtHasLoaded, width, height]);
}
