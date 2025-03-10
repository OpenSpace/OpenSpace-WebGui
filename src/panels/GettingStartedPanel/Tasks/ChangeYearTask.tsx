import { useSubscribeToTime } from '@/api/hooks';

import { TaskCheckbox } from './Components/TaskCheckbox';
import { useTrackChange } from './hooks';

export function ChangeYearTask() {
  const now = useSubscribeToTime();
  const year = now && new Date(now).getUTCFullYear();

  const taskCompleted = useTrackChange(year);

  return <TaskCheckbox taskCompleted={taskCompleted} label={`Change the year`} />;
}
