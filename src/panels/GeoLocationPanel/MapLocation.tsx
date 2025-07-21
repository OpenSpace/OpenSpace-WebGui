import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, ThemeIcon } from '@mantine/core';
import { useMouse, useMove } from '@mantine/hooks';

import { MapData } from '@/components/Map/data';
import { Map } from '@/components/Map/Map';
import { FocusIcon } from '@/icons/icons';
import { useAnchorNode } from '@/util/propertyTreeHooks';

import { MapMarker } from './MapMarker';
import { MouseMarkerPosition } from './types';

interface Props {
  mouseMarker: MouseMarkerPosition;
  setMouseMarker: (marker: MouseMarkerPosition) => void;
  onClick?: (latitude: number, longitude: number) => void;
}

export function MapLocation({ onClick, mouseMarker, setMouseMarker }: Props) {
  const [isHovering, setIsHovering] = useState(false);
  const { ref } = useMove(handleClick);
  const { ref: refMove, x: xHover, y: yHover } = useMouse();
  const { t } = useTranslation('panel-geolocation', { keyPrefix: 'map-location' });

  const anchor = useAnchorNode();

  const isMapInteractable =
    anchor?.identifier && anchor.identifier.toLowerCase() in MapData;
  const mouseIconSize = 25;

  function handleClick({ x, y }: { x: number; y: number }) {
    const coords = mapCoordsToLatLong(x, y);
    if (!coords) {
      return;
    }
    const { latitude, longitude } = coords;
    onClick?.(latitude, longitude);
    setMouseMarker({ x, y });
  }

  function mapCoordsToLatLong(x: number | undefined, y: number | undefined) {
    if (x === undefined || y === undefined) {
      return undefined;
    }
    const longitude = x * 360 - 180;
    const latitude = 90 - y * 180;
    return { latitude, longitude };
  }

  return (
    <Box
      ref={refMove}
      onMouseLeave={() => setIsHovering(false)}
      onMouseMove={() => setIsHovering(true)}
    >
      <Map
        ref={ref}
        bd={'1px solid gray.7'}
        style={{
          overflow: 'hidden',
          position: 'relative',
          cursor: 'pointer'
        }}
      >
        {isMapInteractable && mouseMarker && (
          <MapMarker
            left={`${mouseMarker.x * 100}%`}
            top={`${mouseMarker.y * 100}%`}
            styleProps={{ mixBlendMode: 'difference' }}
          >
            <ThemeIcon variant={'transparent'} color={'white'}>
              <FocusIcon size={mouseIconSize} aria-label={t('aria-labels.mouse-icon')} />
            </ThemeIcon>
          </MapMarker>
        )}
        {isMapInteractable && isHovering && (
          <MapMarker
            left={xHover}
            top={yHover}
            styleProps={{ mixBlendMode: 'difference' }}
          >
            <ThemeIcon variant={'transparent'} color={'white'}>
              <FocusIcon
                size={mouseIconSize}
                opacity={0.8}
                aria-label={t('aria-labels.mouse-icon')}
              />
            </ThemeIcon>
          </MapMarker>
        )}
      </Map>
    </Box>
  );
}
