import { useTranslation } from 'react-i18next';
import { Group, NumberFormatter, Text } from '@mantine/core';

import { useAppSelector } from '@/redux/hooks';

export function CurrentLatLong() {
  const { t } = useTranslation('panel-gettingstartedtour', {
    keyPrefix: 'components.current-lat-long'
  });

  const { latitude: currentLat, longitude: currentLong } = useAppSelector(
    (state) => state.camera
  );

  return (
    <Text>
      <Group>
        {t('label')}:
        <Text span>
          <NumberFormatter value={currentLat} decimalScale={2} suffix={'°'} />,{' '}
          <NumberFormatter value={currentLong} decimalScale={2} suffix={'°'} />
        </Text>
      </Group>
    </Text>
  );
}
