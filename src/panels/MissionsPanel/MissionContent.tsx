import { useMemo, useState } from 'react';
import { Button, Group, Switch, Text, Title } from '@mantine/core';

import { useSubscribeToTime } from '@/api/hooks';
import { InfoBox } from '@/components/InfoBox/InfoBox';
import { ScrollBox } from '@/components/ScrollBox/ScrollBox';

import { TimeLine } from './TimeLine/TimeLine';
import { MissionPhase } from './MissionPhase';
import { DisplayedPhase, DisplayType, Phase } from './types';

interface Props {
  missionOverview: Phase;
}

export function MissionContent({ missionOverview }: Props) {
  const [displayedPhase, setDisplayedPhase] = useState<DisplayedPhase>({
    type: DisplayType.Overview,
    data: missionOverview
  });
  const [displayCurrentPhase, setDisplayCurrentPhase] = useState(false);
  const [lastDisplayedPhase, setLastDisplayedPhase] = useState<DisplayedPhase>({
    type: undefined,
    data: undefined
  });

  const now = useSubscribeToTime();

  const allPhasesNested = useMemo(() => {
    const phasesByDepth: Phase[][] = [];

    function collectPhases(phases: Phase[], depth: number = 0) {
      //Ensure the array for the current depth exists
      if (!phasesByDepth[depth]) {
        phasesByDepth[depth] = [];
      }

      // Add the current phases to the appropriate depth
      phasesByDepth[depth].push(...phases);

      // Recursively process nested phases
      phases.forEach((phase) => {
        if (phase.phases.length > 0) {
          collectPhases(phase.phases, depth + 1);
        }
      });
    }

    collectPhases(missionOverview.phases);

    return phasesByDepth;
  }, [missionOverview]);

  if (displayCurrentPhase) {
    setPhaseToCurrent();
  }

  function setPhaseManually(phase: DisplayedPhase) {
    setDisplayedPhase(phase);
    setDisplayCurrentPhase(false);
  }

  function setPhaseToCurrent() {
    if (now === undefined) {
      return;
    }

    const allPhasesFlat = allPhasesNested.flat();

    const currentPhases = allPhasesFlat.filter((phase) => {
      const isBeforeEnd = now < Date.parse(phase.timerange.end);
      const isAfterStart = now >= Date.parse(phase.timerange.start);
      return isAfterStart && isBeforeEnd;
    });

    // We are outside of the missions time range
    if (currentPhases.length === 0) {
      // We have already set the displayed phase as undefined - do nothing
      if (displayedPhase.type === undefined) {
        return;
      }
      // First time we go outside time boundaries - set as undefined
      setDisplayedPhase({ type: undefined, data: undefined });
    } else {
      const found = currentPhases.pop();
      // Assert is is not undefined
      if (!found) {
        return;
      }
      // If the found phase is already displayed, do nothing
      if (found.name === displayedPhase.data?.name) {
        return;
      }
      setDisplayedPhase({ type: DisplayType.Phase, data: found });
    }
  }

  function toggleCurrentPhase() {
    setDisplayCurrentPhase((prevState) => !prevState);
    if (!displayCurrentPhase) {
      setLastDisplayedPhase(displayedPhase);
    } else {
      setDisplayedPhase(lastDisplayedPhase);
    }
  }

  return (
    <Group wrap={'nowrap'} align={'start'} h={'100%'} gap={0}>
      <TimeLine
        allPhasesNested={allPhasesNested}
        displayedPhase={displayedPhase}
        missionOverview={missionOverview}
        setDisplayedPhase={setPhaseManually}
      />
      <ScrollBox px={'md'} h={'100%'}>
        <Group justify={'space-between'} mb={'md'}>
          <Title order={2}>{missionOverview.name}</Title>
          <Button
            onClick={() =>
              setPhaseManually({ type: DisplayType.Overview, data: missionOverview })
            }
          >
            Overview
          </Button>
        </Group>
        <Group mb={'xs'} gap={'xs'} wrap={'nowrap'}>
          <Switch checked={displayCurrentPhase} onClick={toggleCurrentPhase} />
          <Text>Display current phase</Text>
          <InfoBox
            text={
              'If enabled, the mission phase that is currently happening will be displayed. It will update as time passes.'
            }
          />
        </Group>
        {displayedPhase.data ? (
          <MissionPhase
            displayedPhase={displayedPhase}
            missionOverview={missionOverview}
          />
        ) : (
          'No data for the current time range'
        )}
      </ScrollBox>
    </Group>
  );
}
