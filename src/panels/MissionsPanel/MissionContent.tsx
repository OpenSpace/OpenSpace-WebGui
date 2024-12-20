import { useMemo, useState } from 'react';
import { Button, Container, Group, Switch, Text, Title } from '@mantine/core';

import { useSubscribeToTime } from '@/api/hooks';
import { DisplayType } from '@/types/enums';
import { Milestone, Phase } from '@/types/mission-types';

import { TimeLine } from './TimeLine/TimeLine';
import { MissionPhase } from './MissionPhase';

// TODO anden88: for some reason if this was exported from @types file intelisense showed
// displayedPhase variable as any, aka no type completion :/
export type DisplayedPhase =
  | { type: DisplayType.Phase; data: Phase }
  | { type: DisplayType.Milestone; data: Milestone }
  | { type: undefined; data: undefined };

interface MissionContentProps {
  missionOverview: Phase;
}

export function MissionContent({ missionOverview }: MissionContentProps) {
  const [displayedPhase, setDisplayedPhase] = useState<DisplayedPhase>({
    type: DisplayType.Phase,
    data: missionOverview
  });
  const [displayCurrentPhase, setDisplayCurrentPhase] = useState(false);

  const now = useSubscribeToTime();

  const allPhasesNested = useMemo(() => {
    const phasesByDepth: Phase[][] = [];

    function collectPhases(phases: Phase[], depth: number = 0) {
      //Ensure the array for the current depth exists
      if (!phasesByDepth[depth]) {
        phasesByDepth[depth] = [];
      }

      // Add the current phases to the approrpiate depth
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

  return (
    <Group grow wrap={'nowrap'} align={'start'} my={'xs'}>
      <TimeLine
        allPhasesNested={allPhasesNested}
        displayedPhase={displayedPhase}
        missionOverview={missionOverview}
        setDisplayedPhase={setPhaseManually}
      />
      <Container>
        <Group justify={'space-between'} mb={'md'}>
          <Button
            onClick={() =>
              setPhaseManually({ type: DisplayType.Phase, data: missionOverview })
            }
            variant={'outline'}
            size={'lg'}
          >
            <Title>{missionOverview.name}</Title>
          </Button>
          <Group>
            <Switch
              checked={displayCurrentPhase}
              onClick={() => setDisplayCurrentPhase((prevState) => !prevState)}
            />
            <Text>Show current phase</Text>
          </Group>
        </Group>
        <MissionPhase
          displayedPhase={displayedPhase}
          isMissionOverview={displayedPhase.data?.name === missionOverview.name}
          missionOverview={missionOverview}
        />
      </Container>
    </Group>
  );
}
