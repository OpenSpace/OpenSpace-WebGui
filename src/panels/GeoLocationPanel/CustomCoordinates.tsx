import { useTranslation } from 'react-i18next';
import { Group, Stack, TextInput } from '@mantine/core';

import { NumericInput } from '@/components/Input/NumericInput/NumericInput';
import { LoadingBlocks } from '@/components/LoadingBlocks/LoadingBlocks';
import { NodeNavigationButton } from '@/components/NodeNavigationButton/NodeNavigationButton';
import { NavigationType } from '@/types/enums';
import { useAnchorNode } from '@/util/propertyTreeHooks';

import { AddSceneGraphNodeButton } from './AddSceneGraphNodeButton';
import { Coordinates } from './GeoLocationPanel';

export function CustomCoordinates({
  customName,
  setCustomName,
  coordinates,
  setCoordinates
}: {
  customName: string;
  setCustomName: (value: string) => void;
  coordinates: Coordinates;
  setCoordinates: (value: Coordinates) => void;
}) {
  const { t } = useTranslation('panel-geolocation', {
    keyPrefix: 'custom-coordinates'
  });
  const { lat, long, alt } = coordinates;
  const altitudeInMeter = alt * 1000;

  const anchor = useAnchorNode();

  if (!anchor) {
    return <LoadingBlocks />;
  }
  const previewCustomName = t('node-name-placeholder', {
    anchor: anchor.name,
    latitude: coordinates.lat.toFixed(2),
    longitude: coordinates.long.toFixed(2),
    altitude: coordinates.alt.toFixed(2)
  });

  return (
    <Stack gap={'xs'}>
      <Group grow gap={'xs'} align={'end'}>
        <NumericInput
          label={
            <>
              {t('latitude-label')}{' '}
              <span
                style={{
                  fontWeight: 'normal',
                  color: 'var(--mantine-color-dark-2)',
                  fontSize: 'var(--mantine-h6-font-size)'
                }}
              >
                {t('label-degrees')}
              </span>
            </>
          }
          value={lat}
          onEnter={(value) => setCoordinates({ lat: value, long, alt })}
          min={-90}
          max={90}
          clampBehavior={'strict'}
        />
        <NumericInput
          label={
            <>
              {t('latitude-label')}{' '}
              <span
                style={{
                  fontWeight: 'normal',
                  color: 'var(--mantine-color-dark-2)',
                  fontSize: 'var(--mantine-h6-font-size)'
                }}
              >
                {t('label-degrees')}
              </span>
            </>
          }
          value={long}
          onEnter={(value) => setCoordinates({ lat, long: value, alt })}
          min={-180}
          max={180}
          clampBehavior={'strict'}
        />
        <NumericInput
          label={
            <>
              {t('altitude-label')}{' '}
              <span
                style={{
                  fontWeight: 'normal',
                  color: 'var(--mantine-color-dark-2)',
                  fontSize: 'var(--mantine-h6-font-size)'
                }}
              >
                {t('label-kilometers')}
              </span>
            </>
          }
          value={alt}
          onEnter={(value) => setCoordinates({ lat, long, alt: value })}
          min={0}
          clampBehavior={'strict'}
        />
      </Group>
      <TextInput
        value={customName}
        onChange={(event) => setCustomName(event.currentTarget.value)}
        label={
          <>
            {t('node-name-label')}{' '}
            <span
              style={{
                fontWeight: 'normal',
                color: 'var(--mantine-color-dark-2)',
                fontSize: 'var(--mantine-h6-font-size)'
              }}
            >
              {t('label-optional')}
            </span>
          </>
        }
        placeholder={previewCustomName}
      />
      <Group gap={'xs'} mt={'md'} grow>
        <NodeNavigationButton
          type={NavigationType.FlyGeo}
          showLabel
          identifier={anchor.identifier}
          latitude={lat}
          longitude={long}
          altitude={altitudeInMeter}
        />
        <NodeNavigationButton
          type={NavigationType.JumpGeo}
          showLabel
          identifier={anchor.identifier}
          latitude={lat}
          longitude={long}
          altitude={altitudeInMeter}
        />
        <AddSceneGraphNodeButton
          globe={anchor.identifier}
          identifier={customName || previewCustomName}
          latitude={lat}
          longitude={long}
          altitude={altitudeInMeter}
        />
      </Group>
    </Stack>
  );
}
