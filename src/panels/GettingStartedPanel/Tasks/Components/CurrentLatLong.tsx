import { NumberFormatter, Text } from '@mantine/core';

import { useAppSelector } from '@/redux/hooks';

export function CurrentLatLong() {
  const { latitude: currentLat, longitude: currentLong } = useAppSelector(
    (state) => state.camera
  );

  return (
    <Text>
      Current position (lat, long): (
      <NumberFormatter value={currentLat} decimalScale={2} />,{' '}
      <NumberFormatter value={currentLong} decimalScale={2} />)
    </Text>
  );
}
