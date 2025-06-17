import { useTranslation } from 'react-i18next';
import { Group, Text } from '@mantine/core';

import { Mouse } from './Mouse';

export function NavigationMouse() {
  const { t } = useTranslation('panel-gettingstartedtour', {
    keyPrefix: 'mouse-descriptions'
  });

  return (
    <Group>
      <Text flex={1} c={'dimmed'} fs={'italic'}>
        {t('navigation')}
      </Text>
      <Mouse mouseClick={'left'} arrowDir={'horizontal'} />
    </Group>
  );
}
