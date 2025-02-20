import { Chip, Group } from '@mantine/core';

import { useGetBoolPropertyValue } from '@/api/hooks';
import { RollFrictionKey, RotationalFrictionKey, ZoomFrictionKey } from '@/util/keys';

export function FrictionMenu() {
  const [rotation, setRotation] = useGetBoolPropertyValue(RotationalFrictionKey);
  const [zoom, setZoom] = useGetBoolPropertyValue(ZoomFrictionKey);
  const [roll, setRoll] = useGetBoolPropertyValue(RollFrictionKey);

  return (
    <Group gap={'xs'}>
      <Chip
        checked={rotation}
        onChange={() => setRotation(!rotation)}
        variant={'light'}
        size={'xs'}
        color={"white"}
      >
        Rotation
      </Chip>
      <Chip
        checked={zoom}
        onChange={() => setZoom(!zoom)}
        variant={'light'}
        size={'xs'}
        color={"white"}
      >
        Zoom
      </Chip>
      <Chip
        checked={roll}
        onChange={() => setRoll(!roll)}
        variant={'light'}
        size={'xs'}
        color={"white"}
      >
        Roll
      </Chip>
    </Group>
  );
}
