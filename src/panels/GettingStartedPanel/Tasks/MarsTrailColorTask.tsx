import { useGetVec3PropertyValue } from '@/api/hooks';

import { TaskCheckbox } from './Components/TaskCheckbox';
import { useTrackChange } from './hooks';

export function MarsTrailColorTask() {
  const [color] = useGetVec3PropertyValue('Scene.MarsTrail.Renderable.Appearance.Color');

  const taskCompleted = useTrackChange(color);

  return (
    <TaskCheckbox
      taskCompleted={taskCompleted}
      label={`Change the color of the trail of Mars`}
    />
  );
}
