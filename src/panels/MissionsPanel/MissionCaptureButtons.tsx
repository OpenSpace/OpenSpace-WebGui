import { Button, Group } from '@mantine/core';

import { useOpenSpaceApi, useSubscribeToTime } from '@/api/hooks';
import { Phase } from '@/types/mission-types';

import { jumpToTime } from './util';

interface MissionCaptureButtonsProps {
  mission: Phase;
}

export function MissionCaptureButtons({ mission }: MissionCaptureButtonsProps) {
  const now = useSubscribeToTime();
  const luaApi = useOpenSpaceApi();

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
      {nextCapture && (
        <Button onClick={() => jumpToTime(now, nextCapture, luaApi)}>
          Set Time to Next Capture
        </Button>
      )}
      {prevCapture && (
        <Button onClick={() => jumpToTime(now, prevCapture, luaApi)}>
          Set Time to Previous Capture
        </Button>
      )}
    </Group>
  );
}
