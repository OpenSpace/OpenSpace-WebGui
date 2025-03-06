import { Checkbox } from '@mantine/core';

import { useGetStringPropertyValue, useSubscribeToCamera } from '@/api/hooks';
import { useAppSelector } from '@/redux/hooks';
import { NavigationAnchorKey } from '@/util/keys';

interface Props {
  anchor: string;
  lat?: { value: number; min: number; max: number };
  long?: { value: number; min: number; max: number };
}

function isWithinRange(value: number | undefined, range: { min: number; max: number }) {
  if (value === undefined) {
    return false;
  }
  return value <= range.max && value >= range.min;
}

export function NavigationTask({ anchor, lat, long }: Props) {
  const { latitude: currentLat, longitude: currentLong } = useAppSelector(
    (state) => state.camera
  );
  const [currentAnchor] = useGetStringPropertyValue(NavigationAnchorKey);

  const hasCorrectNode = currentAnchor === anchor;
  // If the lat and long are not provided, we don't need to check them, so set them
  // as if they were correct
  const hasCorrectLatitude = lat ? isWithinRange(currentLat, lat) : true;
  const hasCorrectLongitude = long ? isWithinRange(currentLong, long) : true;

  const taskCompleted = hasCorrectLongitude && hasCorrectLatitude && hasCorrectNode;

  useSubscribeToCamera();

  const latLabel = lat?.value ? `latitude: ${lat.value}` : '';
  const longLabel = long?.value ? `longitude: ${long.value}` : '';

  return (
    <>
      <Checkbox
        size={'lg'}
        c={'orange'}
        color={'green'}
        checked={taskCompleted}
        onChange={() => {}}
        label={`Task: Go to ${latLabel} ${longLabel}`}
        style={{ cursor: 'default' }}
      />
    </>
  );
}
