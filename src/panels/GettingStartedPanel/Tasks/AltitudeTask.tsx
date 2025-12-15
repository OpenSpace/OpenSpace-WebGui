import { useTranslation } from 'react-i18next';

import { useProperty } from '@/hooks/properties';
import { useSceneGraphNode } from '@/hooks/propertyOwner';
import { useSubscribeToCamera } from '@/hooks/topicSubscriptions';
import { useAppSelector } from '@/redux/hooks';
import { NavigationAnchorKey } from '@/util/keys';

import { TaskCheckbox } from './Components/TaskCheckbox';
import { compareAltitude } from './util';

interface Props {
  anchor: string;
  unit: string;
  altitude: number;
  compare: 'lower' | 'higher';
}

export function AltitudeTask({ anchor, unit, altitude, compare }: Props) {
  const { t } = useTranslation('panel-gettingstartedtour', {
    keyPrefix: 'tasks.altitude'
  });

  const currentAltitude = useAppSelector((state) => state.camera.altitude);
  const currentUnit = useAppSelector((state) => state.camera.altitudeUnit);
  const [currentAnchor] = useProperty('StringProperty', NavigationAnchorKey);

  const anchorNode = useSceneGraphNode(anchor);
  useSubscribeToCamera();

  const hasCorrectNode =
    currentAnchor !== undefined && currentAnchor !== '' && currentAnchor === anchor;
  const hasCorrectUnit = currentUnit === unit;
  const hasCorrectAltitude = compareAltitude(currentAltitude, altitude, compare);
  const taskCompleted = hasCorrectAltitude && hasCorrectNode && hasCorrectUnit;

  return (
    <TaskCheckbox
      taskCompleted={taskCompleted}
      label={t(compare === 'higher' ? 'label-higher' : 'label-lower', {
        altitude: `${altitude} ${unit}`,
        object: anchorNode?.name
      })}
    />
  );
}
