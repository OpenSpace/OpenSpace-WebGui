import { useTranslation } from 'react-i18next';
import { Skeleton, Stack, Text } from '@mantine/core';

import { useSubscribeToTime } from '@/hooks/topicSubscriptions';
import { useAppSelector } from '@/redux/hooks';
import { isDateValid } from '@/redux/time/util';

import { useTimePartTranslation } from '../hooks';
import { formatDeltaTime } from '../util';

export function TimePanelMenuButtonContent() {
  const targetDeltaTime = useAppSelector((state) => state.time.targetDeltaTime);
  const isPaused = useAppSelector((state) => state.time.isPaused);
  const timeString = useAppSelector((state) => state.time.timeString);

  const timeCapped = useSubscribeToTime();
  const translateTimePart = useTimePartTranslation();
  const { t } = useTranslation('panel-time');

  const isReady = timeCapped !== undefined || timeString !== undefined;

  const date = new Date(timeCapped ?? '');
  const isValidDate = isDateValid(date);

  const timeLabel = isValidDate ? date.toUTCString() : t('menu-button.error');
  const speedLabel = getFormattedSpeedLabel();

  function getFormattedSpeedLabel() {
    if (targetDeltaTime === undefined) {
      return '';
    }

    const pausedLabel = isPaused
      ? `(${t('menu-button.paused').toLocaleLowerCase()})`
      : '';

    if (targetDeltaTime === 1) {
      return `${t('realtime')} ${pausedLabel}`;
    }

    const { increment, unit, isNegative } = formatDeltaTime(targetDeltaTime);
    const roundedIncrement = Math.round(increment);
    const sign = isNegative ? '-' : '';

    const unitLabel = translateTimePart(unit, roundedIncrement);
    return `${sign}${roundedIncrement} ${unitLabel} / ${t('time-parts.seconds_one')} ${pausedLabel}`.toLocaleLowerCase();
  }

  return (
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
  );
}
