import { useProperty } from '@/hooks/properties';
import { TaskCheckbox } from './Components/TaskCheckbox';
import { useTrackChange } from './hooks';

export function MarsTrailColorTask() {
  const [color] = useProperty(
    'Vec3Property',
    'Scene.MarsTrail.Renderable.Appearance.Color'
  );

  const taskCompleted = useTrackChange(color);

  return (
    <TaskCheckbox
      taskCompleted={taskCompleted}
      label={`Change the color of the trail of Mars`}
    />
  );
}
