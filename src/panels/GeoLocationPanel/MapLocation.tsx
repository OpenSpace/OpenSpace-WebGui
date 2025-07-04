import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Group, Stack, Text, TextInput, Title } from '@mantine/core';

import { CopyToClipboardButton } from '@/components/CopyToClipboardButton/CopyToClipboardButton';
import { NumericInput } from '@/components/Input/NumericInput/NumericInput';
import { LoadingBlocks } from '@/components/LoadingBlocks/LoadingBlocks';
import { MapData } from '@/components/Map/data';
import { Map } from '@/components/Map/Map';
import { NodeNavigationButton } from '@/components/NodeNavigationButton/NodeNavigationButton';
import { useSubscribeToCamera } from '@/hooks/topicSubscriptions';
import { FocusIcon } from '@/icons/icons';
import { useCameraLatLong as useCameraCoordinatesLowPrecision } from '@/redux/camera/hooks';
import { NavigationType } from '@/types/enums';
import { useAnchorNode } from '@/util/propertyTreeHooks';

import { AddSceneGraphNodeButton } from './AddSceneGraphNodeButton';

// The fewer decimals we can get away with, the less the component will rerender due to
// precision issues. 7 decimals gives ~1 cm accuracy in lat & long when copying values.
// https://blis.com/precision-matters-critical-importance-decimal-places-five-lowest-go/
const DecimalPrecision = 7;

export function MapLocation() {
  const [mouseMarker, setMouseMarker] = useState<{
    x: number | undefined;
    y: number | undefined;
  }>({
    x: undefined,
    y: undefined
  });
  const [customName, setCustomName] = useState('');
  const [mouseAltitude, setMouseAltitude] = useState(0);

  // No need to rerender the component when dragging, which is why this is a ref instead of state
  const isDragging = useRef(false);
  const backgroundImageRef = useRef<HTMLDivElement>(null);

  const {
    latitude: currentLat,
    longitude: currentLong,
    altitude: currentAltitude,
    altitudeUnit
  } = useCameraCoordinatesLowPrecision(DecimalPrecision);
  const anchor = useAnchorNode();
  useSubscribeToCamera();

  const { t } = useTranslation('panel-geolocation', { keyPrefix: 'map-location' });
  useEffect(() => {
    // Reset mouse marker when anchor changes
    setMouseMarker({ x: undefined, y: undefined });
    setMouseAltitude(0);
  }, [anchor]);

  if (!anchor) {
    return <LoadingBlocks />;
  }

  const isMapInteractable = anchor.identifier.toLowerCase() in MapData;
  const mouseIconSize = 25;

  const mouseLatLong = mapCoordsToLatLong(mouseMarker.x, mouseMarker.y);
  const mouseAltitudeInMeter = mouseAltitude * 1000;

  const previewCustomName = t('node-name-placeholder', {
    anchor: anchor.name,
    latitude: mouseLatLong.latitude.toFixed(2),
    longitude: mouseLatLong.longitude.toFixed(2),
    altitude: mouseAltitude
  });

  function handleMapDrag(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (!isDragging.current || !backgroundImageRef.current || !isMapInteractable) {
      return;
    }
    handleMapClick(event);
  }

  function handleMapClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (!backgroundImageRef.current || !isMapInteractable) {
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
    <>
      <Group align={'start'}>
        <Stack gap={0}>
          <Group>
            <Title order={2} mb={'xs'}>
              {t('globe-location.title')}
              <CopyToClipboardButton
                value={`${currentLat}, ${currentLong}, ${currentAltitude}${t('globe-location.kilometer-abbreviation')}`}
              />
            </Title>
          </Group>
          <Text size={'md'}>
            {t('globe-location.latitude')}: {currentLat?.toFixed(2)}
          </Text>
          <Text size={'md'}>
            {t('globe-location.longitude')}: {currentLong?.toFixed(2)}
          </Text>
          <Text size={'md'}>
            {t('globe-location.altitude')}: {currentAltitude?.toFixed(2)}
            {altitudeUnit}
          </Text>
        </Stack>
        <Stack gap={0}>
          <Group>
            <Title order={2} mb={'xs'}>
              {t('mouse-location')}
              <CopyToClipboardButton
                value={`${mouseLatLong.latitude.toFixed(DecimalPrecision)}, ${mouseLatLong.longitude.toFixed(DecimalPrecision)}, ${mouseAltitude}${t('globe-location.kilometer-abbreviation')}`}
              />
            </Title>
          </Group>
          <Text size={'md'}>
            {t('globe-location.latitude')}: {mouseLatLong?.latitude.toFixed(2)}
          </Text>
          <Text size={'md'}>
            {t('globe-location.longitude')}: {mouseLatLong?.longitude.toFixed(2)}
          </Text>
          <Text size={'md'}>
            {t('globe-location.altitude')}: {mouseAltitude.toFixed(2)}
            {t('globe-location.kilometer-abbreviation')}
          </Text>
        </Stack>
      </Group>
      <Box
        maw={1024}
        miw={300}
        ref={backgroundImageRef}
        onClick={handleMapClick}
        onMouseMove={handleMapDrag}
        onMouseDown={() => (isDragging.current = true)}
        onMouseUp={() => (isDragging.current = false)}
        style={{ overflow: 'hidden', position: 'relative' }}
      >
        <Map />
        {isMapInteractable &&
          mouseMarker.x !== undefined &&
          mouseMarker.y !== undefined && (
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
      </Box>
      <Stack gap={'xs'}>
        <Group>
          <NumericInput
            label={t('altitude-label')}
            value={mouseAltitude}
            onEnter={(value) => setMouseAltitude(value)}
            min={0}
            clampBehavior={'strict'}
            w={100}
          />
          <TextInput
            value={customName}
            onChange={(event) => setCustomName(event.currentTarget.value)}
            label={t('node-name-label')}
            placeholder={previewCustomName}
            flex={1}
          />
        </Group>
        <Group gap={'xs'}>
          <NodeNavigationButton
            type={NavigationType.FlyGeo}
            showLabel
            identifier={anchor.identifier}
            latitude={mouseLatLong.latitude}
            longitude={mouseLatLong.longitude}
            altitude={mouseAltitudeInMeter}
          />
          <NodeNavigationButton
            type={NavigationType.JumpGeo}
            showLabel
            identifier={anchor.identifier}
            latitude={mouseLatLong.latitude}
            longitude={mouseLatLong.longitude}
            altitude={mouseAltitudeInMeter}
          />
          <AddSceneGraphNodeButton
            globe={anchor.identifier}
            identifier={customName || previewCustomName}
            latitude={mouseLatLong.latitude}
            longitude={mouseLatLong.longitude}
            altitude={mouseAltitudeInMeter}
            onClick={() => setCustomName('')}
          />
        </Group>
      </Stack>
    </>
  );
}
