import { useEffect } from 'react';

// import { useGetBoolPropertyValue } from '@/api/hooks';
import { useWindowSize } from '@/windowmanagement/Window/hooks';

import {
  useSelectedBrowserColor,
  useSelectedBrowserCoords,
  useSelectedBrowserProperty
} from '../hooks';
import { Text } from '@mantine/core';
import { useSendMessageToWwt } from './hooks';
import { useAppSelector } from '@/redux/hooks';

export function WorldWideTelescope() {
  const { ref, setAim, setBorderColor, setBorderRadius, wwtHasLoaded } =
    useSendMessageToWwt();
  const { width, height } = useWindowSize();
  const { ra, dec, fov, roll } = useSelectedBrowserCoords();
  const borderRadius = useSelectedBrowserProperty('borderRadius');
  const borderColor = useSelectedBrowserColor();
  const browsers = useAppSelector((state) => state.skybrowser.browsers);
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

  return noOfBrowsers === 0 ? (
    <Text>No browsers</Text>
  ) : (
    <iframe
      id={'webpage'}
      name={'wwt'}
      title={'WorldWideTelescope'}
      ref={ref}
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
