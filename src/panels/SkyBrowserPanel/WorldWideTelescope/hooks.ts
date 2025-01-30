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

// These are the hooks that will keep tabs of the redux state and
// when it changes, it will pass along these messages to WWT

// The hooks are: images, opacities, aim, border color and border radius
export function useUpdateSelectedImages() {
  const { imageCollectionLoaded, loadImage, removeImage } = useWwtProvider();
  const imageList = useAppSelector((state) => state.skybrowser.imageList);
  const selectedImages = useSkyBrowserSelectedImages();

  // Update images in WWT when the selected images changes
  useEffect(() => {
    if (
      imageList.length === 0 ||
      !imageCollectionLoaded ||
      selectedImages === undefined
    ) {
      return;
    }
    // Brute force this as the performance loss is negligible and there are many complicated cases
    selectedImages.toReversed().map((index) => {
      loadImage(imageList[index]?.url);
    });
    return () => selectedImages?.forEach((image) => removeImage(imageList[image].url));
  }, [imageList, selectedImages, imageCollectionLoaded, loadImage, removeImage]);
}

export function useUpdateOpacities() {
  const { imageCollectionLoaded, setOpacity } = useWwtProvider();
  const imageList = useAppSelector((state) => state.skybrowser.imageList);
  const selectedImages = useSkyBrowserSelectedImages();
  const opacities = useSkyBrowserSelectedOpacities();

  // Update opacities in WWT when the opacities changes
  useEffect(() => {
    if (imageList.length === 0 || !imageCollectionLoaded || opacities === undefined) {
      return;
    }
    // Brute force this as the performance loss is negligible and there are many complicated cases
    opacities.map((opacity, i) => {
      if (!selectedImages) {
        return;
      }
      const { url } = imageList[selectedImages[i]];
      setOpacity(url, opacity);
    });
  }, [imageList, selectedImages, opacities, imageCollectionLoaded, setOpacity]);
}

export function useUpdateAim() {
  const { ra, dec, roll } = useSelectedBrowserCoords();
  const fov = useSelectedBrowserFov();
  const { setAim } = useWwtProvider();

  useEffect(() => {
    if (
      ra !== undefined &&
      dec !== undefined &&
      fov !== undefined &&
      roll !== undefined
    ) {
      setAim(ra, dec, fov, roll);
    }
  }, [ra, dec, fov, roll, setAim]);
}

export function useUpdateBorderColor() {
  const borderColor = useSelectedBrowserColor();
  const { wwtHasLoaded, setBorderColor } = useWwtProvider();

  useEffect(() => {
    if (borderColor && wwtHasLoaded) {
      setBorderColor(borderColor);
    }
  }, [borderColor, wwtHasLoaded, setBorderColor]);
}

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
