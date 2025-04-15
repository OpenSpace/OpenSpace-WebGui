import { Chip, Group, MantineSize, MantineSpacing, Stack, Text } from '@mantine/core';

import { InfoBox } from '@/components/InfoBox/InfoBox';
import { KeybindButtons } from '@/panels/KeybindsPanel/KeybindButtons';
import { useAppSelector } from '@/redux/hooks';
import { RollFrictionKey, RotationalFrictionKey, ZoomFrictionKey } from '@/util/keys';
import { useProperty } from '@/hooks/properties';

interface Props {
  size?: MantineSize;
  gap?: MantineSpacing;
  align?: React.CSSProperties['alignItems'];
  mr?: MantineSpacing;
}

export function FrictionControls({ size, gap = 'xs', align, mr }: Props) {
  const [rotation, setRotation] = useProperty('BoolProperty', RotationalFrictionKey);
  const [zoom, setZoom] = useProperty('BoolProperty', ZoomFrictionKey);
  const [roll, setRoll] = useProperty('BoolProperty', RollFrictionKey);

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
    <Group justify={'space-between'} wrap={'nowrap'} align={align} mr={mr}>
      <Group gap={gap}>
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
      </Group>

      <InfoBox>
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
      </InfoBox>
    </Group>
  );
}
