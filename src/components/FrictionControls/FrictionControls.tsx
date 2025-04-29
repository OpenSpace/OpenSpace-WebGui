import { Chip, MantineSize } from '@mantine/core';

import { useProperty } from '@/hooks/properties';
import { RollFrictionKey, RotationalFrictionKey, ZoomFrictionKey } from '@/util/keys';

interface Props {
  size?: MantineSize;
}

export function FrictionControls({ size }: Props) {
  const [rotation, setRotation] = useProperty('BoolProperty', RotationalFrictionKey);
  const [zoom, setZoom] = useProperty('BoolProperty', ZoomFrictionKey);
  const [roll, setRoll] = useProperty('BoolProperty', RollFrictionKey);

  return (
    <>
      <Chip
        checked={rotation}
        onChange={() => setRotation(!rotation)}
        variant={'light'}
        size={size}
        color={'white'}
      >
        Rotation
      </Chip>
      <Chip
        checked={zoom}
        onChange={() => setZoom(!zoom)}
        variant={'light'}
        size={size}
        color={'white'}
      >
        Zoom
      </Chip>
      <Chip
        checked={roll}
        onChange={() => setRoll(!roll)}
        variant={'light'}
        size={size}
        color={'white'}
      >
        Roll
      </Chip>
    </>
  );
}
