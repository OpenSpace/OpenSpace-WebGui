import { useState } from 'react';
import { Button, Group, Stack, TextInput } from '@mantine/core';

import { NodeNavigationButton } from '@/components/NodeNavigationButton/NodeNavigationButton';
import { PlusIcon } from '@/icons/icons';
import { NavigationType } from '@/types/enums';
import { InlineInput } from '@/panels/TimePanel/InlineInput';

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
  const previewCustomName = `Custom Coordinate (${lat},${long},${alt}km)`;

  function onClick() {
    const address = customName || previewCustomName;
    onAddFocusNodeCallback(address, lat, long, altInKm);
  }

  return (
    <Stack gap={'xs'}>
      <Group gap={'xs'} grow>
        <InlineInput
          label={'Latitude (deg)'}
          value={lat}
          onInputChange={(value: number, relative: boolean) => {
            setLat((oldvalue) => {
              const newValue = relative ? oldvalue + value : value;
              return newValue;
            });
          }}
          min={-90}
          max={90}
        />

        <InlineInput
          label={'Longitude (deg)'}
          value={long}
          onInputChange={(value: number, relative: boolean) => {
            setLong((oldvalue) => {
              const newValue = relative ? oldvalue + value : value;
              return newValue;
            });
          }}
          min={-180}
          max={180}
        />
        <InlineInput
          label={'Altitude'}
          value={alt}
          onInputChange={(value: number, relative: boolean) => {
            setAlt((oldvalue) => {
              const newValue = relative ? oldvalue + value : value;
              return newValue;
            });
          }}
          min={0}
        />
      </Group>
      <TextInput
        value={customName}
        onChange={(event) => setCustomName(event.currentTarget.value)}
        label={'Node name (optional)'}
        placeholder={
          previewCustomName !== '' ? previewCustomName : 'Custom name (optional)'
        }
      />
      <Group gap={'xs'} grow preventGrowOverflow={false}>
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
        <Button onClick={onClick} size={'sm'} leftSection={<PlusIcon />}>
          Add Focus
        </Button>
      </Group>
    </Stack>
  );
}
