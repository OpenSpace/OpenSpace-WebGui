import { Button, Group } from '@mantine/core';

import { DisplayType } from '@/types/enums';

import { DisplayedPhase } from './MissionContent';
import { useJumpToTime } from './hooks';

interface MissionTimeButtonsProps {
  isMissionOverview?: boolean;
  currentPhase: DisplayedPhase;
}

export function MissionTimeButtons({
  isMissionOverview,
  currentPhase
}: MissionTimeButtonsProps) {
  const jumpToTime = useJumpToTime();

  const displayType = currentPhase.type;

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

  function buttons() {
    switch (displayType) {
      case DisplayType.Phase: {
        const phaseType = isMissionOverview ? 'Mission' : 'Phase';
        return (
          <Group preventGrowOverflow={false} grow gap={'xs'}>
            <Button onClick={jumpToEndOfPhase}>Set Time to End of {phaseType}</Button>
            <Button onClick={jumpToStartOfPhase}>
              Set Time to Beginning of {phaseType}
            </Button>
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

  return buttons();
}
