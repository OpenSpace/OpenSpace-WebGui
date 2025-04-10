import { useSubscribeToTime } from '@/hooks/topicSubscriptions';
import { TaskBarMenuButton } from '@/panels/Menu/TaskBar/TaskBarMenuButton';
import { useAppSelector } from '@/redux/hooks';

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
