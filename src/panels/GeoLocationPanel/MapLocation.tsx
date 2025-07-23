import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, ThemeIcon } from '@mantine/core';
import { useMouse, useMove } from '@mantine/hooks';

import { DynamicMap } from '@/components/DynamicMap/DynamicMap';
import { useMapPath } from '@/components/DynamicMap/hooks';
import { MapMarker } from '@/components/DynamicMap/MapMarker';
import { FocusIcon } from '@/icons/icons';
import { useAnchorNode } from '@/util/propertyTreeHooks';

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
  const [, mapExists] = useMapPath(anchor);

  const mouseIconSize = 25;

  function handleClick({ x, y }: { x: number; y: number }) {
    const coords = mapCoordsToLatLong(x, y);
    if (!coords) {
      return;
    }
    onClick?.(coords.latitude, coords.longitude);
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
      <DynamicMap
        ref={ref}
        bd={'1px solid gray.7'}
        style={{
          overflow: 'hidden',
          position: 'relative',
          cursor: 'pointer'
        }}
      >
        {mapExists && mouseMarker && (
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
        {mapExists && isHovering && (
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
      </DynamicMap>
    </Box>
  );
}
