import { Button, Group } from '@mantine/core';

import { DisplayType } from '@/types/enums';

import { useJumpToTime } from './hooks';
import { DisplayedPhase } from './MissionContent';

interface MissionTimeButtonsProps {
  isMissionOverview?: boolean;
  currentPhase: DisplayedPhase;
}

export function MissionTimeButtons({
  isMissionOverview,
  currentPhase
}: MissionTimeButtonsProps) {
  const jumpToTime = useJumpToTime();

  function jumpToEndOfPhase() {
    if (currentPhase.type === DisplayType.Phase) {
      jumpToTime(currentPhase.data.timerange.end);
    }
  }

  function jumpToStartOfPhase() {
    if (currentPhase.type === DisplayType.Phase) {
      jumpToTime(currentPhase.data.timerange.start);
    }
  }

  switch (currentPhase.type) {
    case DisplayType.Phase: {
      const phaseType = isMissionOverview ? 'Mission' : 'Phase';
      return (
        <Group preventGrowOverflow={false} grow gap={'xs'}>
          <Button onClick={jumpToStartOfPhase}>
            Set Time to Beginning of {phaseType}
          </Button>
          <Button onClick={jumpToEndOfPhase}>Set Time to End of {phaseType}</Button>
        </Group>
      );
    }
    case DisplayType.Milestone:
      return (
        <Button onClick={() => jumpToTime(currentPhase.data.date)} w={'100%'}>
          Set Time
        </Button>
      );
    default:
      return <></>;
  }
}
