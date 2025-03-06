import { useAppSelector } from '@/redux/hooks';
import { TaskCheckbox } from './Components/TaskCheckbox';

export function PauseTimeTask() {
  const isPaused = useAppSelector((state) => state.time.isPaused);

  const taskCompleted = isPaused === true;

  return <TaskCheckbox taskCompleted={taskCompleted} label={'Pause the time!'} />;
}
