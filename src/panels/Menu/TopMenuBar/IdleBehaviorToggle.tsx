import { useTranslation } from 'react-i18next';
import { Chip, Group, Text } from '@mantine/core';

import { InfoBox } from '@/components/InfoBox/InfoBox';
import { useProperty } from '@/hooks/properties';
import { KeybindButtons } from '@/panels/KeybindsPanel/KeybindButtons';
import { useAppSelector } from '@/redux/hooks';
import styles from '@/theme/global.module.css';

export function IdleBehaviorToggle() {
  const { t } = useTranslation('menu', { keyPrefix: 'idle-behavior-toggle' });

  const [apply, setApply] = useProperty(
    'BoolProperty',
    'NavigationHandler.OrbitalNavigator.IdleBehavior.ApplyIdleBehavior'
  );

  const keybinds = useAppSelector((state) => state.actions.keybinds);
  const keybind = keybinds.find((keybind) => keybind.action === 'os.ToggleIdleBehavior');

  return (
    <Group gap={'xs'} wrap={'nowrap'}>
      <Chip
        checked={apply}
        onChange={setApply}
        size={'xs'}
        variant={apply ? 'light' : 'transparent'}
        className={apply ? styles.blinking : undefined}
      >
        {t('label')}
      </Chip>
      <InfoBox>
        <Text size={'md'} fw={'bold'}>
          {t('info.heading')}
        </Text>
        <Text>{t('info.description-1')}</Text>
        <Text mt={'sm'}>{t('info.description-2')}</Text>
        {keybind && (
          <Group mt={'sm'}>
            <Text fw={'bold'}>{t('info.keybind-label')}</Text>
            <KeybindButtons keybind={keybind} />
          </Group>
        )}
      </InfoBox>
    </Group>
  );
}
