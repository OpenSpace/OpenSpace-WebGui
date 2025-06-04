import { useTranslation } from 'react-i18next';
import { Button, Group } from '@mantine/core';

import { useSubscribeToTime } from '@/hooks/topicSubscriptions';

import { useJumpToTime } from './hooks';
import { Phase } from './types';

interface Props {
  mission: Phase;
}

export function MissionCaptureButtons({ mission }: Props) {
  const now = useSubscribeToTime();
  const jumpToTime = useJumpToTime();
  const { t } = useTranslation('panel-missions', {
    keyPrefix: 'mission-capture-buttons'
  });

  // Locate the next instrument activity capture
  function getNextCapture() {
    if (now === undefined) {
      return;
    }
    // Assume the captures are stored with regards to time. Find the first time that is
    // after the current time
    const capture = mission.capturetimes.find((capture) => {
      const utcDate = Date.parse(capture);
      return now < utcDate;
    });

    return capture;
  }

  // Locate the previous instrument activity capture
  function getPreviousCapture() {
    if (now === undefined) {
      return;
    }
    // Assume the captures are sorted with regards to time. Find the last time that is
    // before the current time
    const capture = mission.capturetimes.findLast((capture) => {
      const utcDate = Date.parse(capture);
      return now > utcDate;
    });

    return capture;
  }

  const nextCapture = getNextCapture();
  const prevCapture = getPreviousCapture();

  if (!nextCapture && !prevCapture) {
    return <></>;
  }

  return (
    <Group gap={'xs'} grow preventGrowOverflow={false} my={'xs'}>
      {prevCapture && (
        <Button onClick={() => jumpToTime(prevCapture)}>{t('previous-capture')}</Button>
      )}
      {nextCapture && (
        <Button onClick={() => jumpToTime(nextCapture)}> {t('next-capture')}</Button>
      )}
    </Group>
  );
}
