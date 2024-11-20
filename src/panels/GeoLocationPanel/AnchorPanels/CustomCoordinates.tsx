import { useState } from 'react';
import { ActionIcon, Group, NumberInput, Stack, TextInput } from '@mantine/core';

import { PlusIcon } from '@/icons/icons';
import { NodeNavigationButton } from '@/panels/OriginPanel/NodeNavigationButton';
import { NavigationType } from '@/types/enums';

interface Props {
  currentAnchor: string;
  onAddFocusNodeCallback: (
    address: string,
    lat: number,
    long: number,
    alt: number
  ) => void;
}
export function CustomCoordinates({ currentAnchor, onAddFocusNodeCallback }: Props) {
  const [lat, setLat] = useState(0);
  const [long, setLong] = useState(0);
  const [alt, setAlt] = useState(0);
  const [customName, setCustomName] = useState('');
  const altInKm = alt * 1000;

  function onClick() {
    const address = customName || `Custom Coordinate (${lat},${long},${alt}km)`;
    onAddFocusNodeCallback(address, lat, long, altInKm);
  }
  return (
    <Stack gap={'xs'}>
      <Group gap={'xs'} grow>
        <NumberInput
          label={'Latitude'}
          value={lat}
          onChange={(value) => {
            if (typeof value === 'number') {
              setLat(value);
            }
          }}
          min={-90}
          max={90}
        />
        <NumberInput
          label={'Longitude'}
          value={long}
          onChange={(value) => {
            if (typeof value === 'number') {
              setLong(value);
            }
          }}
          min={-180}
          max={180}
        />
        <NumberInput
          label={'Altitude'}
          value={alt}
          onChange={(value) => {
            if (typeof value === 'number') {
              setAlt(value);
            }
          }}
          min={0}
        />
      </Group>
      <TextInput
        value={customName}
        onChange={(event) => setCustomName(event.currentTarget.value)}
        placeholder={'Custom name'}
      />
      <Group gap={'xs'}>
        <NodeNavigationButton
          type={NavigationType.FlyGeo}
          showLabel
          identifier={currentAnchor}
          lat={lat}
          long={long}
          alt={altInKm}
        />
        <NodeNavigationButton
          type={NavigationType.JumpGeo}
          showLabel
          identifier={currentAnchor}
          lat={lat}
          long={long}
          alt={altInKm}
        />
        <ActionIcon onClick={onClick} size={'lg'}>
          <PlusIcon />
        </ActionIcon>
      </Group>
    </Stack>
  );
}
