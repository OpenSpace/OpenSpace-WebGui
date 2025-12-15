import { useTranslation } from 'react-i18next';
import { NumberFormatter, Text } from '@mantine/core';

import { useAppSelector } from '@/redux/hooks';

export function CurrentAltitude() {
  const { t } = useTranslation('panel-gettingstartedtour', {
    keyPrefix: 'components.current-altitude'
  });

  const currentAltitude = useAppSelector((state) => state.camera.altitude);
  const currentUnit = useAppSelector((state) => state.camera.altitudeUnit);

  return (
    <Text>
      {t('label')}:{' '}
      <NumberFormatter
        value={currentAltitude}
        suffix={` ${currentUnit}`}
        thousandSeparator
        decimalScale={0}
      />
    </Text>
  );
}
