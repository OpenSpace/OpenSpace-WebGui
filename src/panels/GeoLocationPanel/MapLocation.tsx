import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  AspectRatio,
  BackgroundImage,
  Group,
  Image,
  Stack,
  Text,
  TextInput,
  Title
} from '@mantine/core';

import { CopyToClipboardButton } from '@/components/CopyToClipboardButton/CopyToClipboardButton';
import { NumericInput } from '@/components/Input/NumericInput/NumericInput';
import { NodeNavigationButton } from '@/components/NodeNavigationButton/NodeNavigationButton';
import { useSubscribeToCamera } from '@/hooks/topicSubscriptions';
import { FocusIcon } from '@/icons/icons';
import { useCameraLatLong } from '@/redux/camera/hooks';
import { NavigationType } from '@/types/enums';
import { useAnchorNode } from '@/util/propertyTreeHooks';

import { AddSceneGraphNodeButton } from './AddSceneGraphNodeButton';

type Source = string;

const maps: Record<string, Source> = {
  callisto: 'callisto.jpg',
  dione: 'dione.jpg',
  earth: 'earth_bluemarble.jpg',
  enceladus: 'enceladus.jpg',
  europa: 'europa.jpg',
  ganymede: 'ganymede.jpg',
  iapetus: 'iapetus.jpg',
  io: 'io.jpg',
  jupiter: 'jupiter.jpg',
  mars: 'mars.jpg',
  mercury: 'mercury.jpg',
  mimas: 'mimas.jpg',
  moon: 'moon.jpg',
  neptune: 'neptune.jpg',
  phobos: 'phobos.jpg',
  rhea: 'rhea.jpg',
  saturn: 'saturn.jpg',
  tethys: 'tethys.jpg',
  titan: 'titan.jpg',
  triton: 'triton.jpg',
  uranus: 'uranus.jpg',
  venus: 'venus.jpg'
};

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
    viewLatitude,
    viewLongitude,
    altitude: currentAltitude
  } = useCameraLatLong(DecimalPrecision);

  const anchor = useAnchorNode();
  useSubscribeToCamera();

  const { t } = useTranslation('panel-geolocation', { keyPrefix: 'map-location' });

  const map = maps[anchor?.identifier?.toLowerCase() ?? ''];

  if (!map || !anchor) {
    return (
      <Alert variant={'light'} color={'orange'} title={t('no-map.title')}>
        <Text>{t('no-map.description', { name: anchor?.name })}</Text>
      </Alert>
    );
  }

  const hasViewDirection = viewLatitude !== undefined && viewLongitude !== undefined;

  const osMarkerPosition = openSpaceMarkerPosition();
  const angle = hasViewDirection ? Math.atan2(viewLongitude, viewLatitude) : 0;
  const angleDeg = angle * (180.0 / Math.PI);

  // Settings for the OpenSpace marker and view cone
  const iconSize = 25;
  const coneWidth = 45;
  const coneHeight = 30;

  const mouseLatLong = mapCoordsToLatLong(mouseMarker.x, mouseMarker.y);
  const previewCustomName = t('node-name-placeholder', {
    anchor: anchor.name,
    latitude: mouseLatLong.latitude.toFixed(2),
    longitude: mouseLatLong.longitude.toFixed(2),
    altitude: mouseAltitude
  });
  const mouseAltitudeInMeter = mouseAltitude * 1000;

  function openSpaceMarkerPosition(): { x: number; y: number } {
    if (currentLong !== undefined && currentLat !== undefined) {
      return {
        x: (currentLong + 180) / 360,
        y: (90 - currentLat) / 180
      };
    }
    return { x: 0, y: 0 };
  }

  function handleMapDrag(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (!isDragging.current || !backgroundImageRef.current) {
      return;
    }
    handleMapClick(event);
  }

  function handleMapClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (!backgroundImageRef.current) {
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
            {t('globe-location.kilometer-abbreviation')}
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
      <AspectRatio ratio={16 / 9} mx={'auto'} maw={1024} miw={300}>
        <BackgroundImage
          key={'mytestkey'}
          src={`${import.meta.env.BASE_URL}/images/maps/${map}`}
          ref={backgroundImageRef}
          style={{ overflow: 'hidden', position: 'relative' }}
          onClick={handleMapClick}
          onMouseMove={handleMapDrag}
          onMouseDown={() => (isDragging.current = true)}
          onMouseUp={() => (isDragging.current = false)}
          aria-label={t('aria-labels.map', { mapName: anchor.name })}
        >
          <div
            style={{
              position: 'absolute',
              left: `${osMarkerPosition.x * 100}%`,
              top: `${osMarkerPosition.y * 100}%`,
              width: 0,
              height: 0,
              transform: `translate(-0%, -0%) rotate(${angleDeg}deg)`
            }}
          >
            {hasViewDirection && (
              <svg
                width={coneWidth}
                height={coneHeight}
                viewBox={`0 0 ${coneWidth} ${coneHeight}`}
                style={{
                  transform: `translate(-50%, ${-coneHeight - iconSize / 4}px)`
                }}
                aria-label={t('aria-labels.view-direction')}
              >
                <polygon
                  points={`${coneWidth / 2},${coneHeight} 0,0 ${coneWidth},0`}
                  fill={'rgba(68, 175, 105, 0.7)'}
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
          </div>
          {mouseMarker.x !== undefined && mouseMarker.y !== undefined && (
            <FocusIcon
              style={{
                width: iconSize,
                height: iconSize,
                position: 'relative',
                left: `${mouseMarker.x * 100}%`,
                top: `${mouseMarker.y * 100}%`,
                transform: 'translate(-50%, -50%)'
              }}
              aria-label={t('aria-labels.mouse-icon')}
            />
          )}
        </BackgroundImage>
      </AspectRatio>
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
          />
        </Group>
      </Stack>
    </>
  );
}
