import { Button, Group } from '@mantine/core';

import { GoToEnd, GoToStart, TimerIcon } from '@/icons/icons';
import { DisplayType, IconSize } from '@/types/enums';
import { DisplayedPhase } from '@/types/mission-types';

import { useJumpToTime } from './hooks';

interface Props {
  currentPhase: DisplayedPhase;
}

export function MissionTimeButtons({ currentPhase }: Props) {
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
        <Group>
          <Button
            onClick={jumpToStartOfPhase}
            leftSection={<GoToStart size={IconSize.xs} />}
          >
            Start of {phaseType}
          </Button>
          <Button
            onClick={jumpToEndOfPhase}
            rightSection={<GoToEnd size={IconSize.xs} />}
          >
            End of {phaseType}
          </Button>
        </Group>
      );
    }
    case DisplayType.Milestone:
      return (
        <Button onClick={() => jumpToTime(currentPhase.data.date)} fullWidth>
          <Group>
            <TimerIcon />
            Set Time
          </Group>
        </Button>
      );
    default:
      return <></>;
  }
}
