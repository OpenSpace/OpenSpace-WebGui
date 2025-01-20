import { Button, Group } from '@mantine/core';

import { GoToEnd, GoToStart, TimerIcon } from '@/icons/icons';
import { DisplayType } from '@/types/enums';

import { useJumpToTime } from './hooks';
import { DisplayedPhase } from './MissionContent';

interface MissionTimeButtonsProps {
  currentPhase: DisplayedPhase;
}

export function MissionTimeButtons({ currentPhase }: MissionTimeButtonsProps) {
  const jumpToTime = useJumpToTime();
  const isMissionOverview = currentPhase.type === DisplayType.Overview;

  function jumpToEndOfPhase() {
    if (currentPhase.type === DisplayType.Phase || isMissionOverview) {
      jumpToTime(currentPhase.data.timerange.end);
    }
  }

  function jumpToStartOfPhase() {
    if (currentPhase.type === DisplayType.Phase || isMissionOverview) {
      jumpToTime(currentPhase.data.timerange.start);
    }
  }

  switch (currentPhase.type) {
    case DisplayType.Overview:
    case DisplayType.Phase: {
      const phaseType = isMissionOverview ? 'Mission' : 'Phase';
      return (
        <>
          <Group preventGrowOverflow={false} grow gap={'xs'}>
            <Button onClick={jumpToStartOfPhase}>
              <Group wrap={'nowrap'}>
                <GoToStart />
                Go to Beginning of {phaseType}
              </Group>
            </Button>
            <Button onClick={jumpToEndOfPhase}>
              <Group wrap={'nowrap'}>
                <GoToEnd />
                Go to End of {phaseType}
              </Group>
            </Button>
          </Group>
        </>
      );
    }
    case DisplayType.Milestone:
      return (
        <Button onClick={() => jumpToTime(currentPhase.data.date)} fullWidth>
          <Group wrap={'nowrap'}>
            <TimerIcon />
            Set Time
          </Group>
        </Button>
      );
    default:
      return <></>;
  }
}
