import { useTranslation } from 'react-i18next';
import { Chip, Group, Text } from '@mantine/core';

import { InfoBox } from '@/components/InfoBox/InfoBox';
import { useProperty } from '@/hooks/properties';
import { KeybindButtons } from '@/panels/KeybindsPanel/KeybindButtons';
import { useAppSelector } from '@/redux/hooks';
import styles from '@/theme/global.module.css';

export function IdleMotionToggle() {
  const { t } = useTranslation('menu', { keyPrefix: 'idle-motion-toggle' });

  const [applyIdleMotion, setApplyIdleMotion] = useProperty(
    'BoolProperty',
    'NavigationHandler.OrbitalNavigator.IdleMotion.Apply'
  );

  const keybinds = useAppSelector((state) => state.actions.keybinds);
  const keybind = keybinds.find((keybind) => keybind.action === 'os.ToggleIdleMotion');

  return (
    <Group gap={'xs'} wrap={'nowrap'}>
      <Chip
        checked={applyIdleMotion}
        onChange={setApplyIdleMotion}
        size={'xs'}
        variant={applyIdleMotion ? 'light' : 'transparent'}
        className={applyIdleMotion ? styles.blinking : undefined}
      >
        {t('label')}
      </Chip>
      <InfoBox>
        <Text size={'md'} fw={'bold'}>
          {t('info.heading')}
        </Text>
        {t('info.description', { returnObjects: true }).map((text, index) => (
          <Text key={index} mb={'xs'}>
            {text}
          </Text>
        ))}
        {keybind && (
          <Group>
            <Text fw={'bold'}>{t('info.keybind-label')}</Text>
            <KeybindButtons selectedKey={keybind.key} modifiers={keybind.modifiers} />
          </Group>
        )}
      </InfoBox>
    </Group>
  );
}
