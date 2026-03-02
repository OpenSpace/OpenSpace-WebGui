import { useTranslation } from 'react-i18next';

import { usePropertyValue } from '@/hooks/properties';
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
  const { t } = useTranslation('panel-gettingstartedtour', {
    keyPrefix: 'tasks.navigation'
  });

  const { latitude: currentLat, longitude: currentLong } = useAppSelector(
    (state) => state.camera
  );
  const currentAnchor = usePropertyValue('StringProperty', NavigationAnchorKey);
  useSubscribeToCamera();

  const hasCorrectNode = currentAnchor === anchor;
  // If the lat and long are not provided, we don't need to check them, so set them
  // as if they were correct
  const hasCorrectLatitude = lat ? isWithinRange(currentLat, lat) : true;
  const hasCorrectLongitude = long ? isWithinRange(currentLong, long) : true;

  const taskCompleted = hasCorrectLongitude && hasCorrectLatitude && hasCorrectNode;

  let label = '';
  if (lat && long) {
    label = t('label-lat-long', { latitude: lat.value, longitude: long.value });
  } else if (long && !lat) {
    label = t('label-long', { longitude: long.value });
  } else if (!long && lat) {
    label = t('label-lat', { latitude: lat.value });
  } else {
    throw new Error('Either lat or long must be provided');
  }

  return <TaskCheckbox taskCompleted={taskCompleted} label={label} />;
}
