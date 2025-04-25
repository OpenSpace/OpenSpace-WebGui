import { Group, Stack, Text } from '@mantine/core';

import { KeybindButtons } from '@/panels/KeybindsPanel/KeybindButtons';
import { useAppSelector } from '@/redux/hooks';

export function FrictionControlsInfo() {
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
    <>
      <Text size={'md'} fw={'bold'}>
        Friction controls:
      </Text>
      <Text>
        Enable or disable rotation, zoom, and roll friction. If checked, applies friction
        to camera movement.
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
  );
}
