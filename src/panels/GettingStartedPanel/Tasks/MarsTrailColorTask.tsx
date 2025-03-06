import { useGetVec3PropertyValue } from '@/api/hooks';

import { useTrackChange } from './hooks';
import { TaskCheckbox } from './Components/TaskCheckbox';

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
