import { PropsWithChildren, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Image, MantineStyleProps } from '@mantine/core';

import { MapMarker } from '@/components/DynamicMap/MapMarker';
import { NightShadow } from '@/components/DynamicMap/NightShadow';
import { useSubscribeToCamera } from '@/hooks/topicSubscriptions';
import { useCameraLatLong } from '@/redux/camera/hooks';

import { Map } from './Map';
import { ViewCone } from './ViewCone';

// The fewer decimals we can get away with, the less the component will rerender due to
// precision issues. 7 decimals gives ~1 cm accuracy in lat & long when copying values.
// https://blis.com/precision-matters-critical-importance-decimal-places-five-lowest-go/
const DecimalPrecision = 7;

// Settings for the OpenSpace marker and view cone
interface Props extends MantineStyleProps, PropsWithChildren {
  // The URL to the image used as the icon indicating the current camera position
  iconPath?: string;

  // The size of the icon indicating the current camera position in pixels
  iconSize?: number;

  // The width of the cone indicating the camera direction. The width represents how wide
  // the cone will be at the maximum height. In approximate pixels
  coneWidth?: number;

  // The height of the cone indicating the camera direction. The height is used for the
  // distance how far away from the icon the cone should reach. In approximate pixels
  coneHeight?: number;

  // This value signals whether the cone showing the camera direction should be shown
  showViewDirection?: boolean;

  ref?: React.RefObject<HTMLDivElement>;
  style?: React.CSSProperties;
}

/**
 * A dynamic map component that displays the current camera position and view direction ¨
 * on a map of the current anchor node. It also shows the night shadow on the map,
 * dynamically computed from the sun position.
 */
export function DynamicMap({
  iconPath = `${import.meta.env.BASE_URL}/images/icon.png`,
  iconSize = 25,
  coneWidth = 25,
  coneHeight = 25,
  showViewDirection = true,
  ref,
  children,
  style,
  ...styleProps
}: Props) {
  const { t } = useTranslation('components', { keyPrefix: 'map' });

  const {
    latitude: currentLat,
    longitude: currentLong,
    viewLatitude,
    viewLongitude
  } = useCameraLatLong(DecimalPrecision);
  const refSize = useRef<HTMLDivElement>(null);
  const width = refSize?.current?.clientWidth;
  const height = refSize?.current?.clientHeight;

  useSubscribeToCamera();

  const hasViewDirection = viewLatitude !== undefined && viewLongitude !== undefined;
  const markerPosition = (() => {
    if (currentLong === undefined || currentLat === undefined) {
      return { x: 0, y: 0 };
    }

    return {
      x: (currentLong + 180) / 360,
      y: (90 - currentLat) / 180
    };
  })();
  const angle = hasViewDirection ? Math.atan2(viewLongitude, viewLatitude) : 0;
  const angleDeg = angle * (180.0 / Math.PI);
  // Remove jumping between 0 and -180 degrees when looking straight at surface
  const cleanedAngle = Math.abs(angleDeg) === 180 ? 0 : angleDeg;

  return (
    <Map ref={ref} refSize={refSize} style={style} {...styleProps}>
      {width && height && <NightShadow width={width} height={height} />}
      {children}
      <MapMarker left={`${markerPosition.x * 100}%`} top={`${markerPosition.y * 100}%`}>
        <Box
          style={{
            width: 0,
            height: 0,
            transform: `rotate(${cleanedAngle}deg)`
          }}
        >
          <Image
            src={iconPath}
            style={{
              width: iconSize,
              height: iconSize,
              position: 'absolute',
              top: 0,
              left: 0,
              transform: 'translate(-50%, -50%)'
            }}
            aria-label={t('aria-labels.openspace-icon')}
          />
        </Box>
      </MapMarker>
      {width && height && showViewDirection && hasViewDirection && (
        <ViewCone
          width={width}
          height={height}
          coneWidth={coneWidth}
          coneHeight={coneHeight}
        />
      )}
    </Map>
  );
}
