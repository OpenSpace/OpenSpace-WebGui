import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, AspectRatio, Box } from '@mantine/core';

import { MapData } from '@/components/Map/data';
import { Map } from '@/components/Map/Map';
import { useSubscribeToCamera } from '@/hooks/topicSubscriptions';
import { FocusIcon } from '@/icons/icons';
import { useAnchorNode } from '@/util/propertyTreeHooks';

export type MouseMarker =
  | {
      x: number;
      y: number;
    }
  | undefined;

export function MapLocation({
  onClick,
  mouseMarker,
  setMouseMarker
}: {
  mouseMarker: MouseMarker;
  setMouseMarker: (marker: MouseMarker) => void;
  onClick?: (latitude: number, longitude: number) => void;
}) {
  const [hoverMarker, setHoverMarker] = useState<MouseMarker>(undefined);

  // No need to rerender the component when dragging, which is why this is a ref instead of state
  const isDragging = useRef(false);
  const backgroundImageRef = useRef<HTMLDivElement>(null);

  useSubscribeToCamera();
  const anchor = useAnchorNode();

  const { t } = useTranslation('panel-geolocation', { keyPrefix: 'map-location' });

  const isMapInteractable =
    anchor?.identifier && anchor.identifier.toLowerCase() in MapData;
  const mouseIconSize = 25;

  function handleMapHover(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (!backgroundImageRef.current || !isMapInteractable) {
      return;
    }
    const { clientWidth: width, clientHeight: height } = backgroundImageRef.current;

    // Get the hovered position on the map
    const bounds = backgroundImageRef.current.getBoundingClientRect();
    const hoverX = event.clientX - bounds.left;
    const hoverY = event.clientY - bounds.top;

    // Normalize coordinates
    const xNorm = hoverX / width;
    const yNorm = hoverY / height;
    setHoverMarker({ x: xNorm, y: yNorm });
  }

  function handleMapDrag(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    handleMapHover(event);
    if (!isDragging.current || !backgroundImageRef.current || !isMapInteractable) {
      return;
    }
    handleMapClick(event);
  }

  function handleMapClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (!backgroundImageRef.current || !isMapInteractable) {
      console.log(backgroundImageRef.current, isMapInteractable);
      return;
    }
    const { clientWidth: width, clientHeight: height } = backgroundImageRef.current;

    // Get the clicked position on the map
    const bounds = backgroundImageRef.current.getBoundingClientRect();
    const clickX = event.clientX - bounds.left;
    const clickY = event.clientY - bounds.top;

    // Normalize coordinates
    const xNorm = clickX / width;
    const yNorm = clickY / height;
    setMouseMarker({ x: xNorm, y: yNorm });

    const mouseLatLong = mapCoordsToLatLong(xNorm, yNorm);

    onClick?.(mouseLatLong.latitude, mouseLatLong.longitude);
  }

  function mapCoordsToLatLong(
    x: number | undefined,
    y: number | undefined
  ): { latitude: number; longitude: number } {
    if (x === undefined || y === undefined) {
      return { latitude: 0, longitude: 0 };
    }
    const longitude = x * 360 - 180;
    const latitude = 90 - y * 180;
    return { latitude, longitude };
  }

  return (
    <AspectRatio ratio={16 / 9} mx={'auto'} miw={300}>
      <Box
        maw={1024}
        miw={300}
        ref={backgroundImageRef}
        onClick={handleMapClick}
        onMouseMove={handleMapDrag}
        onMouseOut={() => setHoverMarker(undefined)}
        onMouseDown={() => (isDragging.current = true)}
        onMouseUp={() => (isDragging.current = false)}
        style={{
          overflow: 'hidden',
          position: 'relative',
          border: 'solid 1px var(--mantine-color-gray-7)',
          cursor: 'pointer'
        }}
      >
        <Map />
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
        {isMapInteractable && hoverMarker !== undefined && (
          <FocusIcon
            style={{
              width: mouseIconSize,
              height: mouseIconSize,
              position: 'absolute',
              left: `${hoverMarker.x * 100}%`,
              top: `${hoverMarker.y * 100}%`,
              transform: 'translate(-50%, -50%)',
              opacity: 0.5,
              zIndex: 1000
            }}
            aria-label={t('aria-labels.mouse-icon')}
          />
        )}
      </Box>
    </AspectRatio>
  );
}
