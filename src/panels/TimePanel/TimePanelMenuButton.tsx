import { useEffect } from 'react';
import { Button, Skeleton, Stack, Text } from '@mantine/core';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { subscribeToTime, unsubscribeToTime } from '@/redux/time/timeMiddleware';
import { isDateValid } from '@/redux/time/util';

interface TimePanelMenuButtonProps {
  onClick: () => void;
}
export function TimePanelMenuButton({ onClick }: TimePanelMenuButtonProps) {
  const dispatch = useAppDispatch();
  const time = useAppSelector((state) => state.time.time);
  const targetDeltaTime = useAppSelector((state) => state.time.targetDeltaTime);
  const isPaused = useAppSelector((state) => state.time.isPaused);

  const isReady = time !== undefined;

  const date = new Date(time ?? '');
  const isValiDate = isDateValid(date);

  const timeLabel = isValiDate ? date.toUTCString() : 'Date out of range';
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

    const isNegative = Math.sign(targetDeltaTime) === -1;
    const sign = isNegative ? '-' : '';

    const { increment, unit } = formatDeltaTime(Math.abs(targetDeltaTime));
    const roundedIncrement = Math.round(increment);
    const pluralSuffix = roundedIncrement !== 1 ? 's' : '';

    return `${sign}${roundedIncrement} ${unit}${pluralSuffix} / second ${isPaused ? '(Paused)' : ''}`;
  }

  function formatDeltaTime(absDeltaSeconds: number): { increment: number; unit: string } {
    let unit = 'second';
    let increment = absDeltaSeconds;

    // Limit: the threshold to check if we should switch to the next unit
    // Factor: value to divide when moving to the new unit
    const timeUnits = [
      { limit: 60 * 2, factor: 60, unit: 'minute' },
      { limit: 60 * 2, factor: 60, unit: 'hour' },
      { limit: 24 * 2, factor: 24, unit: 'day' },
      { limit: (365 / 12) * 2, factor: 365 / 12, unit: 'month' },
      { limit: 12, factor: 12, unit: 'year' }
    ];

    for (const { limit, factor, unit: nextUnit } of timeUnits) {
      if (increment < limit) {
        break;
      }
      increment /= factor;
      unit = nextUnit;
    }

    return { increment, unit };
  }

  return (
    <Button onClick={onClick} size={'xl'} disabled={!isReady}>
      <Stack gap={0} align={'flex-start'}>
        {isReady ? (
          <>
            <Text size={'lg'}>{timeLabel}</Text>
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
