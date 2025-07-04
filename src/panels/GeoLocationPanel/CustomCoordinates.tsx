import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Group, Stack, TextInput } from '@mantine/core';

import { NumericInput } from '@/components/Input/NumericInput/NumericInput';
import { LoadingBlocks } from '@/components/LoadingBlocks/LoadingBlocks';
import { NodeNavigationButton } from '@/components/NodeNavigationButton/NodeNavigationButton';
import { NavigationType } from '@/types/enums';
import { useAnchorNode } from '@/util/propertyTreeHooks';

import { AddSceneGraphNodeButton } from './AddSceneGraphNodeButton';

export function CustomCoordinates() {
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [altitude, setAltitude] = useState(0);
  const [customName, setCustomName] = useState('');
  const { t } = useTranslation('panel-geolocation', {
    keyPrefix: 'custom-coordinates'
  });
  const altitudeInMeter = altitude * 1000;

  const anchor = useAnchorNode();

  if (!anchor) {
    return <LoadingBlocks />;
  }
  const previewCustomName = t('node-name-placeholder', {
    anchor: anchor.name,
    latitude,
    longitude,
    altitude
  });

  return (
    <Stack gap={'xs'}>
      <Group grow gap={'xs'} align={'end'}>
        <NumericInput
          label={t('latitude-label')}
          value={latitude}
          onEnter={(value) => setLatitude(value)}
          min={-90}
          max={90}
          clampBehavior={'strict'}
        />
        <NumericInput
          label={t('longitude-label')}
          value={longitude}
          onEnter={(value) => setLongitude(value)}
          min={-180}
          max={180}
          clampBehavior={'strict'}
        />
        <NumericInput
          label={t('altitude-label')}
          value={altitude}
          onEnter={(value) => setAltitude(value)}
          min={0}
          clampBehavior={'strict'}
        />
      </Group>
      <TextInput
        value={customName}
        onChange={(event) => setCustomName(event.currentTarget.value)}
        label={t('node-name-label')}
        placeholder={previewCustomName}
      />
      <Group gap={'xs'}>
        <NodeNavigationButton
          type={NavigationType.FlyGeo}
          showLabel
          identifier={anchor.identifier}
          latitude={latitude}
          longitude={longitude}
          altitude={altitudeInMeter}
        />
        <NodeNavigationButton
          type={NavigationType.JumpGeo}
          showLabel
          identifier={anchor.identifier}
          latitude={latitude}
          longitude={longitude}
          altitude={altitudeInMeter}
        />
        <AddSceneGraphNodeButton
          globe={anchor.identifier}
          identifier={customName || previewCustomName}
          latitude={latitude}
          longitude={longitude}
          altitude={altitudeInMeter}
        />
      </Group>
    </Stack>
  );
}
