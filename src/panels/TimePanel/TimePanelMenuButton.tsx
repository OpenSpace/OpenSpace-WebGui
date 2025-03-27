import { Skeleton, Stack, Text } from '@mantine/core';

import { useSubscribeToTime } from '@/hooks/topicSubscriptions';
import { TaskBarMenuButton } from '@/panels/Menu/TaskBar/TaskBarMenuButton';
import { useAppSelector } from '@/redux/hooks';
import { isDateValid } from '@/redux/time/util';

import { formatDeltaTime } from './util';

interface Props {
  id: string;
}

export function TimePanelMenuButton({ id }: Props) {
  const targetDeltaTime = useAppSelector((state) => state.time.targetDeltaTime);
  const isPaused = useAppSelector((state) => state.time.isPaused);
  const timeString = useAppSelector((state) => state.time.timeString);

  const timeCapped = useSubscribeToTime();

  const isReady = timeCapped !== undefined || timeString !== undefined;

  const date = new Date(timeCapped ?? '');
  const isValidDate = isDateValid(date);

  const timeLabel = isValidDate ? date.toUTCString() : 'Date out of range';
  const speedLabel = getFormattedSpeedLabel();

  function getFormattedSpeedLabel() {
    if (targetDeltaTime === undefined) {
      return '';
    }

    if (targetDeltaTime === 1) {
      return `Realtime ${isPaused ? '(Paused)' : ''}`;
    }

    const { increment, unit, isNegative } = formatDeltaTime(targetDeltaTime);
    const roundedIncrement = Math.round(increment);
    const sign = isNegative ? '-' : '';

    return `${sign}${roundedIncrement} ${unit} / second ${isPaused ? '(Paused)' : ''}`;
  }

  return (
    <TaskBarMenuButton id={id} disabled={!isReady}>
      <Stack gap={0} align={'flex-start'}>
        {isReady ? (
          <>
            <Text size={'lg'}>{isValidDate ? timeLabel : timeString}</Text>
            <Text>{speedLabel}</Text>
          </>
        ) : (
          <>
            <Skeleton mb={'xs'}>Mon, 03 Feb 2025 15:11:47</Skeleton>
            <Skeleton h={'sm'} w={'30%'} />
          </>
        )}
      </Stack>
    </TaskBarMenuButton>
  );
}
