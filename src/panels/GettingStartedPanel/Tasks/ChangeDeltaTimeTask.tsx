import { useAppSelector } from '@/redux/hooks';

import { TaskCheckbox } from './Components/TaskCheckbox';
import { useTrackChange } from './hooks';

export function ChangeDeltaTimeTask() {
  const deltaTime = useAppSelector((state) => state.time.deltaTime);
  const taskCompleted = useTrackChange(deltaTime);

  return (
    <TaskCheckbox
      taskCompleted={taskCompleted}
      label={'Change the delta time for the simulation speed'}
    />
  );
}
