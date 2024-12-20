import { Button, Group } from '@mantine/core';

import { useOpenSpaceApi, useSubscribeToTime } from '@/api/hooks';
import { DisplayType } from '@/types/enums';

import { DisplayedPhase } from './MissionContent';
import { jumpToTime } from './util';

interface MissionTimeButtonsProps {
  isMissionOverview?: boolean;
  currentPhase: DisplayedPhase;
}

export function MissionTimeButtons({
  isMissionOverview,
  currentPhase
}: MissionTimeButtonsProps) {
  const luaApi = useOpenSpaceApi();
  const now = useSubscribeToTime();

  const displayType = currentPhase.type;

  function jumpToEndOfPhase() {
    if (currentPhase.type === DisplayType.Phase) {
      jumpToTime(now, currentPhase.data.timerange.end, luaApi);
    }
  }
  function jumpToStartOfPhase() {
    if (currentPhase.type === DisplayType.Phase) {
      jumpToTime(now, currentPhase.data.timerange.start, luaApi);
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
          <Button
            onClick={() => jumpToTime(now, currentPhase.data.date, luaApi)}
            w={'100%'}
          >
            Set Time
          </Button>
        );
      default:
        return <></>;
    }
  }

  return buttons();
}
