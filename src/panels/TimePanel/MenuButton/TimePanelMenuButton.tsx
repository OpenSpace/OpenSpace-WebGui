import { useSubscribeToTime } from '@/hooks/topicSubscriptions';
import { useAppSelector } from '@/redux/hooks';

import { TaskBarMenuButton } from '../../Menu/TaskBar/TaskBarMenuButton';

import { TimePanelMenuButtonContent } from './TimePanelMenuButtonContent';

interface Props {
  id: string;
}

export function TimePanelMenuButton({ id }: Props) {
  const timeString = useAppSelector((state) => state.time.timeString);
  const timeCapped = useSubscribeToTime();
  const isReady = timeCapped !== undefined || timeString !== undefined;

  return (
    <TaskBarMenuButton id={id} disabled={!isReady}>
      <TimePanelMenuButtonContent />
    </TaskBarMenuButton>
  );
}
