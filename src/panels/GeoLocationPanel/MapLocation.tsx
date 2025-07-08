import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { MapData } from '@/components/Map/data';
import { Map } from '@/components/Map/Map';
import { FocusIcon } from '@/icons/icons';
import { useAnchorNode } from '@/util/propertyTreeHooks';
import { useMouse, useMove } from '@mantine/hooks';
import { MouseMarker } from './types';

export function MapLocation({
  onClick,
  mouseMarker,
  setMouseMarker
}: {
  mouseMarker: MouseMarker;
  setMouseMarker: (marker: MouseMarker) => void;
  onClick?: (latitude: number, longitude: number) => void;
}) {
  const { ref } = useMove(handleClick);
  const [isHovering, setIsHovering] = useState(false);
  const { ref: refMove, x: xHover, y: yHover } = useMouse();

  const anchor = useAnchorNode();

  const { t } = useTranslation('panel-geolocation', { keyPrefix: 'map-location' });

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
    <Map
      ref={(el) => {
        ref.current = el;
        refMove.current = el;
      }}
      onMouseOut={() => setIsHovering(false)}
      onMouseMove={() => setIsHovering(true)}
      bd={'1px solid gray.7'}
      style={{
        overflow: 'hidden',
        position: 'relative',
        cursor: 'pointer',
        backgroundColor: 'pink'
      }}
    >
      {isMapInteractable && mouseMarker !== undefined && (
        <FocusIcon
          style={{
            width: mouseIconSize,
            height: mouseIconSize,
            position: 'absolute',
            left: `${mouseMarker.x * 100}%`,
            top: `${mouseMarker.y * 100}%`,
            transform: 'translate(-50%, -50%)'
          }}
          aria-label={t('aria-labels.mouse-icon')}
        />
      )}
      {isMapInteractable && isHovering && (
        <FocusIcon
          style={{
            width: mouseIconSize,
            height: mouseIconSize,
            position: 'absolute',
            left: xHover,
            top: yHover,
            transform: 'translate(-50%, -50%)',
            opacity: 0.5
          }}
          aria-label={t('aria-labels.mouse-icon')}
        />
      )}
    </Map>
  );
}
