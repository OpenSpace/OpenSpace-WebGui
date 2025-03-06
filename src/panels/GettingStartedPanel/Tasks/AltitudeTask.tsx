import { useGetStringPropertyValue, useSubscribeToCamera } from '@/api/hooks';
import { useAppSelector } from '@/redux/hooks';
import { NavigationAnchorKey } from '@/util/keys';

import { compareAltitude } from './util';
import { TaskCheckbox } from './Components/TaskCheckbox';

interface Props {
  anchor: string;
  unit: string;
  altitude: number;
  compare: 'lower' | 'higher';
}

export function AltitudeTask({ anchor, unit, altitude, compare }: Props) {
  const currentAltitude = useAppSelector((state) => state.camera.altitude);
  const currentUnit = useAppSelector((state) => state.camera.altitudeUnit);
  const [currentAnchor] = useGetStringPropertyValue(NavigationAnchorKey);

  const hasCorrectNode =
    currentAnchor !== undefined && currentAnchor !== '' && currentAnchor === anchor;
  const hasCorrectUnit = currentUnit === unit;
  const hasCorrectAltitude = compareAltitude(currentAltitude, altitude, compare);
  const taskCompleted = hasCorrectAltitude && hasCorrectNode && hasCorrectUnit;

  useSubscribeToCamera();

  return (
    <TaskCheckbox
      taskCompleted={taskCompleted}
      label={`Go to an altitude ${compare} than ${altitude} ${unit} on ${anchor}!`}
    />
  );
}
