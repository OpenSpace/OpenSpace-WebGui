import { useProperty } from '@/hooks/properties';
import { useSubscribeToCamera } from '@/hooks/topicSubscriptions';
import { useAppSelector } from '@/redux/hooks';
import { RequireAtLeastOne } from '@/types/types';
import { NavigationAnchorKey } from '@/util/keys';

import { TaskCheckbox } from './Components/TaskCheckbox';

interface Props {
  anchor: string;
  lat?: { value: number; min: number; max: number };
  long?: { value: number; min: number; max: number };
}

type RequiredProps = RequireAtLeastOne<Props, 'lat' | 'long'>;

function isWithinRange(value: number | undefined, range: { min: number; max: number }) {
  if (value === undefined) {
    return false;
  }
  return value >= range.min && value <= range.max;
}

export function NavigationTask({ anchor, lat, long }: RequiredProps) {
  const { latitude: currentLat, longitude: currentLong } = useAppSelector(
    (state) => state.camera
  );
  const [currentAnchor] = useProperty('StringProperty', NavigationAnchorKey);

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
    <TaskCheckbox
      taskCompleted={taskCompleted}
      label={`Go to ${latLabel} ${longLabel}`}
    />
  );
}
