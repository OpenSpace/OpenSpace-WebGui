import { useEffect } from 'react';

// import { useGetBoolPropertyValue } from '@/api/hooks';
import { useWindowSize } from '@/windowmanagement/Window/hooks';

import { useSelectedBrowserCoords, useSelectedBrowserProperty } from '../hooks';

import { useSendMessageToWwt } from './hooks';

export function WorldWideTelescope() {
  const { ref, setAim, setBorderColor, setBorderRadius } = useSendMessageToWwt();
  const { width, height } = useWindowSize();
  const { ra, dec, fov, roll } = useSelectedBrowserCoords();
  const borderRadius = useSelectedBrowserProperty('borderRadius');
  const borderColor = useSelectedBrowserProperty('color');
  // const id = useSelectedBrowserProperty('id');
  // console.log(ra);
  // const [inverseZoom, setInverseZoom] = useGetBoolPropertyValue(
  //   'Modules.SkyBrowser.InverseZoomDirection'
  // );

  useEffect(() => {
    setAim(ra, dec, fov, roll);
  }, [ra, dec, fov, roll, setAim]);

  // useEffect(() => {
  //   if (borderColor) {
  //     setBorderColor(borderColor);
  //   }
  // }, [borderColor]);

  useEffect(() => {
    if (borderRadius) {
      setBorderRadius(borderRadius);
    }
  }, [borderRadius, setBorderRadius]);

  return (
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
    >
      <p>ERROR: cannot display AAS WorldWide Telescope research app!</p>
    </iframe>
  );
}
