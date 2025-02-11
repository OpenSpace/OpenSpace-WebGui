import { useState } from 'react';
import { Button, Group, Stack, TextInput } from '@mantine/core';

import { NumericInput } from '@/components/Input/NumericInput/NumericInput';
import { NodeNavigationButton } from '@/components/NodeNavigationButton/NodeNavigationButton';
import { PlusIcon } from '@/icons/icons';
import { NavigationType } from '@/types/enums';
import { Identifier } from '@/types/types';

interface Props {
  currentAnchor: Identifier;
  onAddFocusNodeCallback: (
    address: string,
    latitude: number,
    longitude: number,
    altitude: number
  ) => void;
}
export function CustomCoordinates({ currentAnchor, onAddFocusNodeCallback }: Props) {
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [altitude, setAltitude] = useState(0);
  const [customName, setCustomName] = useState('');
  const altInKm = altitude * 1000;
  const previewCustomName = `Custom Coordinate (${latitude},${longitude},${altitude}km)`;

  function onClick() {
    const address = customName || previewCustomName;
    onAddFocusNodeCallback(address, latitude, longitude, altInKm);
  }

  return (
    <Stack gap={'xs'}>
      <Group grow gap={'xs'} align={'end'}>
        <NumericInput
          label={'Latitude (deg)'}
          value={latitude}
          onEnter={(value) => setLatitude(value)}
          min={-90}
          max={90}
          clampBehavior={'strict'}
        />
        <NumericInput
          label={'Longitude (deg)'}
          value={longitude}
          onEnter={(value) => setLongitude(value)}
          min={-180}
          max={180}
          clampBehavior={'strict'}
        />
        <NumericInput
          label={'Altitude (m)'}
          value={longitude}
          onEnter={(value) => setAltitude(value)}
          min={0}
          clampBehavior={'strict'}
        />
      </Group>
      <TextInput
        value={customName}
        onChange={(event) => setCustomName(event.currentTarget.value)}
        label={'Node name (optional)'}
        placeholder={previewCustomName}
      />
      <Group gap={'xs'}>
        <NodeNavigationButton
          type={NavigationType.FlyGeo}
          showLabel
          identifier={currentAnchor}
          lat={latitude}
          long={longitude}
          alt={altInKm}
        />
        <NodeNavigationButton
          type={NavigationType.JumpGeo}
          showLabel
          identifier={currentAnchor}
          lat={latitude}
          long={longitude}
          alt={altInKm}
        />
        <Button onClick={onClick} size={'sm'} leftSection={<PlusIcon />}>
          Add Focus
        </Button>
      </Group>
    </Stack>
  );
}
