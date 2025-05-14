import { useTranslation } from 'react-i18next';
import { Group, Stack, Text } from '@mantine/core';

import { KeybindButtons } from '@/panels/KeybindsPanel/KeybindButtons';
import { useAppSelector } from '@/redux/hooks';

export function FrictionControlsInfo() {
  const keybinds = useAppSelector((state) => state.actions.keybinds);
  const { t } = useTranslation('components');

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
        {t('friction-controls.info.heading')}:
      </Text>
      <Text>{t('friction-controls.info.description')}</Text>
      <Stack gap={'xs'}>
        {rotationKeybind && (
          <Group justify={'space-between'}>
            <Text fw={'bold'}>{t('friction-controls.rotation-label')}:</Text>
            <KeybindButtons
              modifiers={rotationKeybind.modifiers}
              selectedKey={rotationKeybind.key}
            />
          </Group>
        )}
        {zoomKeybind && (
          <Group justify={'space-between'}>
            <Text fw={'bold'}>{t('friction-controls.zoom-label')}:</Text>
            <KeybindButtons
              modifiers={zoomKeybind.modifiers}
              selectedKey={zoomKeybind.key}
            />
          </Group>
        )}
        {rollKeybind && (
          <Group justify={'space-between'}>
            <Text fw={'bold'}>{t('friction-controls.roll-label')}:</Text>
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
