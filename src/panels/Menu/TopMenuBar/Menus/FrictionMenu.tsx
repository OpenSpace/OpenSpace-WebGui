import { Chip, Group, Stack, Text } from '@mantine/core';

import { useGetBoolPropertyValue } from '@/api/hooks';
import { InfoBox } from '@/components/InfoBox/InfoBox';
import { KeybindButtons } from '@/panels/KeybindsPanel/KeybindButtons';
import { useAppSelector } from '@/redux/hooks';
import { RollFrictionKey, RotationalFrictionKey, ZoomFrictionKey } from '@/util/keys';

export function FrictionMenu() {
  const [rotation, setRotation] = useGetBoolPropertyValue(RotationalFrictionKey);
  const [zoom, setZoom] = useGetBoolPropertyValue(ZoomFrictionKey);
  const [roll, setRoll] = useGetBoolPropertyValue(RollFrictionKey);

  const keybinds = useAppSelector((state) => state.actions.keybinds);

  const rotationKeybind = keybinds.find(
    (keybind) => keybind.action === 'os.ToggleRotationFriction'
  );
  const zoomKeybind = keybinds.find(
    (keybind) => keybind.action === 'os.ToggleZoomFriction'
  );
  const rollKeybind = keybinds.find(
    (keybind) => keybind.action === 'os.ToggleRollFriction'
  );

  return (
    <Group gap={'xs'} mr={'xs'}>
      <Chip
        checked={rotation}
        onChange={() => setRotation(!rotation)}
        variant={'light'}
        size={'xs'}
        color={'white'}
      >
        Rotation
      </Chip>
      <Chip
        checked={zoom}
        onChange={() => setZoom(!zoom)}
        variant={'light'}
        size={'xs'}
        color={'white'}
      >
        Zoom
      </Chip>
      <Chip
        checked={roll}
        onChange={() => setRoll(!roll)}
        variant={'light'}
        size={'xs'}
        color={'white'}
      >
        Roll
      </Chip>
      <InfoBox
        text={
          <>
            <Text size={'md'} fw={'bold'}>
              Friction controls:
            </Text>
            <Text>
              Enable or disable rotation, zoom, and roll friction. If checked, applies
              friction to camera movement.
            </Text>
            <Stack gap={'xs'}>
              {rotationKeybind && (
                <Group justify={'space-between'}>
                  <Text fw={'bold'}>Rotation:</Text>
                  <KeybindButtons
                    modifiers={rotationKeybind.modifiers}
                    selectedKey={rotationKeybind.key}
                  />
                </Group>
              )}
              {zoomKeybind && (
                <Group justify={'space-between'}>
                  <Text fw={'bold'}>Zoom:</Text>
                  <KeybindButtons
                    modifiers={zoomKeybind.modifiers}
                    selectedKey={zoomKeybind.key}
                  />
                </Group>
              )}
              {rollKeybind && (
                <Group justify={'space-between'}>
                  <Text fw={'bold'}>Roll:</Text>
                  <KeybindButtons
                    modifiers={rollKeybind.modifiers}
                    selectedKey={rollKeybind.key}
                  />
                </Group>
              )}
            </Stack>
          </>
        }
      />
    </Group>
  );
}
