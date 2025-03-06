import { useAppSelector } from '@/redux/hooks';

import { useTrackChange } from './hooks';
import { TaskCheckbox } from './Components/TaskCheckbox';

export function ChangeDeltaTimeTask() {
  const deltaTime = useAppSelector((state) => state.time.deltaTime);
  const taskCompleted = useTrackChange(deltaTime);

  return <TaskCheckbox taskCompleted={taskCompleted} label={'Change the delta time'} />;
}
