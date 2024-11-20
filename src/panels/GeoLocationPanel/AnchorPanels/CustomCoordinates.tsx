import { useEffect, useState } from 'react';
import { Button, Group, Stack, TextInput } from '@mantine/core';

import { NumericInput } from '@/components/Input/NumericInput';
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

  const [previewCustomName, setPreviewCustomName] = useState('');

  function onClick() {
    const address = customName || `Custom Coordinate (${lat},${long},${alt}km)`;
    onAddFocusNodeCallback(address, lat, long, altInKm);
    setPreviewCustomName('');
  }

  useEffect(() => {
    setPreviewCustomName(`Custom Coordinate (${lat},${long},${alt}km)`);
  }, [lat, long, alt]);

  return (
    <Stack gap={'xs'}>
      <Group gap={'xs'} grow>
        <NumericInput
          label={'Latitude (deg)'}
          defaultValue={lat}
          onEnter={(value) => setLat(value)}
          min={-90}
          max={90}
        />
        <NumericInput
          label={'Longitude (deg)'}
          defaultValue={long}
          onEnter={(value) => setLong(value)}
          min={-180}
          max={180}
        />
        <NumericInput
          label={'Altitude'}
          defaultValue={alt}
          onEnter={(value) => setAlt(value)}
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
        <Button onClick={onClick} size={'sm'} leftSection={<PlusIcon />}>
          Add Focus
        </Button>
      </Group>
    </Stack>
  );
}
