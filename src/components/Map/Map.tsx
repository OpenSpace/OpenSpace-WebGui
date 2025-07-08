import { PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  AspectRatio,
  BackgroundImage,
  Box,
  Image,
  MantineStyleProps,
  Text
} from '@mantine/core';

import { useSubscribeToCamera } from '@/hooks/topicSubscriptions';
import { useCameraLatLong } from '@/redux/camera/hooks';
import { useAnchorNode } from '@/util/propertyTreeHooks';

import { MapData } from './data';
import { MapMarker } from '@/panels/GeoLocationPanel/MapMarker';
import styles from './Map.module.css';

// The fewer decimals we can get away with, the less the component will rerender due to
// precision issues. 7 decimals gives ~1 cm accuracy in lat & long when copying values.
// https://blis.com/precision-matters-critical-importance-decimal-places-five-lowest-go/
const DecimalPrecision = 7;

interface Props extends MantineStyleProps, PropsWithChildren {
  // Settings for the OpenSpace marker and view cone
  iconSize?: number;
  coneWidth?: number;
  coneHeight?: number;
  showViewDirection?: boolean;
  ref?: React.Ref<HTMLDivElement> | React.RefObject<HTMLDivElement>;
  style?: React.CSSProperties;
  onMouseOut?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onMouseMove?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

export function Map({
  iconSize = 25,
  coneWidth = 45,
  coneHeight = 30,
  showViewDirection = true,
  onMouseMove,
  onMouseOut,
  ref,
  children,
  style,
  ...styleProps
}: Props) {
  const {
    latitude: currentLat,
    longitude: currentLong,
    viewLatitude,
    viewLongitude
  } = useCameraLatLong(DecimalPrecision);

  useSubscribeToCamera();

  const anchor = useAnchorNode();

  const map = MapData[anchor?.identifier?.toLowerCase() ?? ''];
  const { t } = useTranslation('components', { keyPrefix: 'map' });

  const hasViewDirection = viewLatitude !== undefined && viewLongitude !== undefined;
  const osMarkerPosition = openSpaceMarkerPosition();
  const angle = hasViewDirection ? Math.atan2(viewLongitude, viewLatitude) : 0;
  const angleDeg = angle * (180.0 / Math.PI);

  function openSpaceMarkerPosition(): { x: number; y: number } {
    if (currentLong !== undefined && currentLat !== undefined) {
      return {
        x: (currentLong + 180) / 360,
        y: (90 - currentLat) / 180
      };
    }
    return { x: 0, y: 0 };
  }

  if (!map || !anchor) {
    return (
      <Alert variant={'light'} color={'orange'} title={t('no-map.title')}>
        <Text>{t('no-map.description', { name: anchor?.name })}</Text>
      </Alert>
    );
  }

  return (
    <AspectRatio
      ratio={16 / 9}
      mx={'auto'}
      miw={300}
      {...styleProps}
      ref={ref}
      style={style}
      onMouseOut={onMouseOut}
      onMouseMove={onMouseMove}
    >
      <BackgroundImage
        src={`${import.meta.env.BASE_URL}/images/maps/${map}`}
        style={{ position: 'relative' }}
        aria-label={t('aria-labels.map', { mapName: anchor.name })}
      >
        <MapMarker
          left={`${osMarkerPosition.x * 100}%`}
          top={`${osMarkerPosition.y * 100}%`}
        >
          <Box
            style={{
              width: 0,
              height: 0,
              transform: `rotate(${angleDeg}deg)`
            }}
          >
            {showViewDirection && hasViewDirection && (
              <svg
                width={coneWidth}
                height={coneHeight}
                viewBox={`0 0 ${coneWidth} ${coneHeight}`}
                style={{
                  transform: `translate(-50%, ${-coneHeight - iconSize / 4}px)`
                }}
                aria-label={t('aria-labels.view-direction')}
              >
                <defs>
                  <radialGradient id="Gradient1" gradientTransform="scale(1, 2)">
                    <stop className={styles.stop1} offset="0%" />
                    <stop className={styles.stop2} offset="80%" />
                    <stop className={styles.stop3} offset="100%" />
                  </radialGradient>
                </defs>

                <polygon
                  points={`${coneWidth},0 ${coneWidth / 2},${coneHeight} 0,0`}
                  fill={`url(#Gradient1)`} // Use the gradient defined above
                />
              </svg>
            )}
            <Image
              src={`${import.meta.env.BASE_URL}/images/icon.png`}
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
        {children}
      </BackgroundImage>
    </AspectRatio>
  );
}
