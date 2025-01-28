import { useWindowSize } from '@/windowmanagement/Window/hooks';

import { Text } from '@mantine/core';
import {
  useUpdateAim,
  useUpdateBorderColor,
  useUpdateBorderRadius,
  useUpdateOpacities,
  useUpdateSelectedImages,
  useWwtProvider
} from './WwtProvider/hooks';
import { useAppSelector } from '@/redux/hooks';

export function WorldWideTelescope() {
  const { ref } = useWwtProvider();
  const { width, height } = useWindowSize();

  const browsers = useAppSelector((state) => state.skybrowser.browsers);
  const noOfBrowsers = Object.keys(browsers).length;

  // const id = useSelectedBrowserProperty('id');
  // console.log(ra);
  // const [inverseZoom, setInverseZoom] = useGetBoolPropertyValue(
  //   'Modules.SkyBrowser.InverseZoomDirection'
  // );

  // A bunch of hooks that pass messages to WWT when our redux state changes
  useUpdateAim();
  useUpdateSelectedImages();
  useUpdateOpacities();
  useUpdateBorderRadius();
  useUpdateBorderColor();

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
