import { useEffect } from 'react';

// import { useGetBoolPropertyValue } from '@/api/hooks';
import { useWindowSize } from '@/windowmanagement/Window/hooks';

import {
  useSelectedBrowserColor,
  useSelectedBrowserCoords,
  useSelectedBrowserProperty
} from '../hooks';
import { Text } from '@mantine/core';
import { useWwtProvider } from './WwtProvider/hooks';
import { useAppSelector } from '@/redux/hooks';

export function WorldWideTelescope() {
  const {
    ref,
    setAim,
    setBorderColor,
    setBorderRadius,
    wwtHasLoaded,
    imageCollectionLoaded,
    loadImage,
    setOpacity,
    removeImage
  } = useWwtProvider();
  const { width, height } = useWindowSize();
  const { ra, dec, fov, roll } = useSelectedBrowserCoords();
  const borderRadius = useSelectedBrowserProperty('borderRadius');
  const selectedImages = useSelectedBrowserProperty('selectedImages');
  const opacities = useSelectedBrowserProperty('opacities');
  const borderColor = useSelectedBrowserColor();
  const browsers = useAppSelector((state) => state.skybrowser.browsers);
  const imageList = useAppSelector((state) => state.skybrowser.imageList);
  const noOfBrowsers = Object.keys(browsers).length;

  // const id = useSelectedBrowserProperty('id');
  // console.log(ra);
  // const [inverseZoom, setInverseZoom] = useGetBoolPropertyValue(
  //   'Modules.SkyBrowser.InverseZoomDirection'
  // );

  useEffect(() => {
    setAim(ra, dec, fov, roll);
  }, [ra, dec, fov, roll, setAim]);

  useEffect(() => {
    if (borderColor && wwtHasLoaded) {
      setBorderColor(borderColor);
    }
  }, [borderColor, wwtHasLoaded]);

  useEffect(() => {
    if (borderRadius && wwtHasLoaded) {
      setBorderRadius(borderRadius);
    }
  }, [borderRadius, setBorderRadius, wwtHasLoaded]);

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
      const url = imageList[selectedImages[i]].url;
      setOpacity(url, opacity);
    });
  }, [imageList, selectedImages, opacities, imageCollectionLoaded]);

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
  }, [imageList, selectedImages, imageCollectionLoaded]);

  return noOfBrowsers === 0 ? (
    <Text>No browsers</Text>
  ) : (
    <iframe
      ref={ref}
      id={'webpage'}
      name={'wwt'}
      title={'WorldWideTelescope'}
      src={'http://wwt.openspaceproject.com/1/gui/'}
      allow={'accelerometer; clipboard-write; gyroscope'}
      allowFullScreen
      height={height}
      width={width}
      style={{ borderWidth: 0 }}
    >
      <p>ERROR: cannot display AAS WorldWide Telescope research app!</p>
    </iframe>
  );
}
