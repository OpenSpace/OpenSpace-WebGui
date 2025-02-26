import { useEffect } from 'react';
import { Button, Skeleton, Stack, Text } from '@mantine/core';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { subscribeToTime, unsubscribeToTime } from '@/redux/time/timeMiddleware';
import { isDateValid } from '@/redux/time/util';

import { formatDeltaTime } from './util';

interface TimePanelMenuButtonProps {
  onClick: () => void;
}
export function TimePanelMenuButton({ onClick }: TimePanelMenuButtonProps) {
  const dispatch = useAppDispatch();
  const timeCapped = useAppSelector((state) => state.time.timeCapped);
  const targetDeltaTime = useAppSelector((state) => state.time.targetDeltaTime);
  const isPaused = useAppSelector((state) => state.time.isPaused);
  const backupTimeString = useAppSelector((state) => state.time.backupTimeString);

  const isReady = timeCapped !== undefined || backupTimeString !== undefined;

  const date = new Date(timeCapped ?? '');
  const isValidDate = isDateValid(date);

  const timeLabel = isValidDate ? date.toUTCString() : 'Date out of range';
  const speedLabel = getFormattedSpeedLabel();

  useEffect(() => {
    dispatch(subscribeToTime());

    return () => {
      dispatch(unsubscribeToTime());
    };
  }, [dispatch]);

  function getFormattedSpeedLabel() {
    if (targetDeltaTime === undefined) {
      return '';
    }

    if (targetDeltaTime === 1) {
      return `Realtime ${isPaused ? '(Paused)' : ''}`;
    }

    const { increment, unit, sign } = formatDeltaTime(Math.abs(targetDeltaTime));
    const roundedIncrement = Math.round(increment);
    const pluralSuffix = roundedIncrement !== 1 ? 's' : '';

    return `${sign}${roundedIncrement} ${unit}${pluralSuffix} / second ${isPaused ? '(Paused)' : ''}`;
  }

  return (
    <Button onClick={onClick} size={'xl'} variant={'menubar'} disabled={!isReady}>
      <Stack gap={0} align={'flex-start'}>
        {isReady ? (
          <>
            <Text size={'lg'}>{isValidDate ? timeLabel : backupTimeString}</Text>
            <Text>{speedLabel}</Text>
          </>
        ) : (
          <>
            <Skeleton mb={'xs'}>Mon, 03 Feb 2025 15:11:47</Skeleton>
            <Skeleton h={'sm'} w={'30%'} />
          </>
        )}
      </Stack>
    </Button>
  );
}
