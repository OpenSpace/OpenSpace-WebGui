import { useTranslation } from 'react-i18next';
import { Box, Group, Text } from '@mantine/core';

import { Mouse } from './Mouse';

export function AltitudeMouse() {
  const { t } = useTranslation('panel-gettingstartedtour', {
    keyPrefix: 'mouse-descriptions'
  });

  return (
    <Group>
      <Box flex={2}>
        <Text c={'dimmed'} fs={'italic'}>
          {t('altitude')}
        </Text>
      </Box>
      <Box flex={1}>
        <Mouse mouseClick={'right'} arrowDir={'vertical'} />
      </Box>
    </Group>
  );
}
