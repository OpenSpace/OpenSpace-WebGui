import { NumberFormatter, Text } from '@mantine/core';

import { useAppSelector } from '@/redux/hooks';

export function CurrentAltitude() {
  const currentAltitude = useAppSelector((state) => state.camera.altitude);
  const currentUnit = useAppSelector((state) => state.camera.altitudeUnit);

  return (
    <Text>
      Current altitude:{' '}
      <NumberFormatter
        value={currentAltitude}
        suffix={` ${currentUnit}`}
        thousandSeparator
        decimalScale={0}
      />
    </Text>
  );
}
