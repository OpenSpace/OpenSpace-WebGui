import { useSubscribeToCamera } from '@/hooks/topicSubscriptions';
import { useAppSelector } from '@/redux/hooks';
import { NavigationAnchorKey } from '@/util/keys';

import { TaskCheckbox } from './Components/TaskCheckbox';
import { compareAltitude } from './util';
import { useProperty } from '@/types/hooks';

interface Props {
  anchor: string;
  unit: string;
  altitude: number;
  compare: 'lower' | 'higher';
}

export function AltitudeTask({ anchor, unit, altitude, compare }: Props) {
  const currentAltitude = useAppSelector((state) => state.camera.altitude);
  const currentUnit = useAppSelector((state) => state.camera.altitudeUnit);
  const [currentAnchor] = useProperty('StringProperty', NavigationAnchorKey);

  useSubscribeToCamera();

  const hasCorrectNode =
    currentAnchor !== undefined && currentAnchor !== '' && currentAnchor === anchor;
  const hasCorrectUnit = currentUnit === unit;
  const hasCorrectAltitude = compareAltitude(currentAltitude, altitude, compare);
  const taskCompleted = hasCorrectAltitude && hasCorrectNode && hasCorrectUnit;

  return (
    <TaskCheckbox
      taskCompleted={taskCompleted}
      label={`Go to an altitude ${compare} than ${altitude} ${unit} on ${anchor}!`}
    />
  );
}
