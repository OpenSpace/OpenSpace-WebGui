import { Button, Group } from '@mantine/core';

import { useGetBoolPropertyValue } from '@/api/hooks';
import { RollFrictionKey, RotationalFrictionKey, ZoomFrictionKey } from '@/util/keys';

export function FrictionMenu() {
  const [rotation, setRotation] = useGetBoolPropertyValue(RotationalFrictionKey);
  const [zoom, setZoom] = useGetBoolPropertyValue(ZoomFrictionKey);
  const [roll, setRoll] = useGetBoolPropertyValue(RollFrictionKey);

  return (
    <Group pos={'absolute'} left={'50%'} style={{ transform: 'translateX(-50%)' }}>
      <Button
        onClick={() => setRotation(!rotation)}
        variant={"filled"}
        color={rotation ? 'green' : 'red'}
        size={"xs"}
      >
        Rotation
      </Button>
      <Button
        onClick={() => setZoom(!zoom)}
        variant={"filled"}
        color={zoom ? 'green' : 'red'}
        size={"xs"}
      >
        Zoom
      </Button>
      <Button
        onClick={() => setRoll(!roll)}
        variant={"filled"}
        color={roll ? 'green' : 'red'}
        size={"xs"}
      >
        Roll
      </Button>
    </Group>
  );
}
