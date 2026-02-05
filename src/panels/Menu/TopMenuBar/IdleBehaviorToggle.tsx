import { Chip, Group, Text } from '@mantine/core';

import { InfoBox } from '@/components/InfoBox/InfoBox';
import { useProperty } from '@/hooks/properties';
import { KeybindButtons } from '@/panels/KeybindsPanel/KeybindButtons';
import { useAppSelector } from '@/redux/hooks';
import styles from '@/theme/global.module.css';

export function IdleBehaviorToggle() {
  const [apply, setApply] = useProperty(
    'BoolProperty',
    'NavigationHandler.OrbitalNavigator.IdleBehavior.ApplyIdleBehavior'
  );

  const keybinds = useAppSelector((state) => state.actions.keybinds);

  // TODO: Fix keybind
  const keybind = keybinds.find((keybind) => keybind.action === 'os.ToggleIdleBehavior');

  return (
    <Group gap={'xs'}>
      <Chip
        checked={apply}
        onChange={setApply}
        size={'xs'}
        variant={apply ? 'light' : 'transparent'}
        className={apply ? styles.blinking : undefined}
      >
        Idle behavior
      </Chip>
      <InfoBox>
        <Text size={'md'} fw={'bold'}>
          Idle behavior:
        </Text>
        <Text>
          When enabled, the camera will auto-rotate around the current focus until the
          next navigation interaction.
        </Text>
        <Text mt={'sm'}>
          Idle behavior can be set to trigger automatically after inactivity. See Orbital
          Navigator settings for this and other options, including speed.
        </Text>
        {keybind && (
          <Group mt={'sm'}>
            <Text fw={'bold'}>Toggle keybind:</Text>
            <KeybindButtons keybind={keybind} />
          </Group>
        )}
      </InfoBox>
    </Group>
  );
}
