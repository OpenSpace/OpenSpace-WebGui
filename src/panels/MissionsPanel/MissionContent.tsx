import { useMemo, useState } from 'react';
import { Button, Container, Flex, Group, Image, Text, Title } from '@mantine/core';

import { ActionsButton } from '@/panels/ActionsPanel/ActionsButton';
import { DisplayType } from '@/types/enums';
import { Milestone, Phase } from '@/types/mission-types';

import { TimeLine } from './TimeLine/TimeLine';
import { MissionCaptureButtons } from './MissionCaptureButtons';
import { MissionTimeButtons } from './MissionTimeButtons';
import { useSubscribeToTime } from '@/api/hooks';

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

  function title() {
    // Hide title if the overview is currently shown
    const isShowingOverview = displayedPhase.data?.name === missionOverview.name;
    const hasType = displayedPhase.type;
    const hideTile = isShowingOverview || !hasType;
    return hideTile ? '' : `${displayedPhase.type}: ${displayedPhase.data.name}`;
  }

  function timeString() {
    switch (displayedPhase.type) {
      case DisplayType.Phase: {
        const start = new Date(displayedPhase.data.timerange.start).toDateString();
        const end = new Date(displayedPhase.data.timerange.end).toDateString();
        return `${start} - ${end}`;
      }
      case DisplayType.Milestone:
        return new Date(displayedPhase.data.date).toDateString();
      default:
        return '';
    }
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

    const filteredPhases = allPhasesFlat.filter((phase) => {
      const isBeforeEnd = now < Date.parse(phase.timerange.end);
      const isAfterStart = now >= Date.parse(phase.timerange.start);
      return isAfterStart && isBeforeEnd;
    });

    const found = filteredPhases.pop();
    if (!found) {
      setDisplayedPhase({ type: undefined, data: undefined });
    } else {
      // If the found phase is already displayed, do nothing
      if (found.name === displayedPhase.data?.name) {
        return;
      }
      setDisplayedPhase({ type: DisplayType.Phase, data: found });
    }
  }

  return (
    <Container my={'xs'}>
      <Group grow wrap={'nowrap'} align={'start'}>
        <TimeLine
          allPhasesNested={allPhasesNested}
          displayedPhase={displayedPhase}
          missionOverview={missionOverview}
          setDisplayedPhase={setPhaseManually}
        />
        <div style={{ maxWidth: 'none' }}>
          <Group grow gap={'xs'}>
            <Button
              onClick={() =>
                setPhaseManually({ type: DisplayType.Phase, data: missionOverview })
              }
            >
              Overview
            </Button>
            <Button
              onClick={() => setDisplayCurrentPhase((prevState) => !prevState)}
              variant={displayCurrentPhase ? 'filled' : 'light'}
            >
              Current Phase
            </Button>
          </Group>
          {displayedPhase.data ? (
            <>
              <Title order={4}>{title()}</Title>
              <Text c={'dimmed'}>{timeString()}</Text>
              <Text my={'xs'}>{displayedPhase.data.description}</Text>
              {displayedPhase.data.link && (
                <Button component={'a'} href={displayedPhase.data.link} target={'_blank'}>
                  Read more
                </Button>
              )}
              {displayedPhase.data.image && (
                <Image
                  my={'xs'}
                  maw={window.innerWidth * 0.25}
                  src={displayedPhase.data.image}
                  alt={'Image text not available'}
                />
              )}
              <MissionTimeButtons
                currentPhase={displayedPhase}
                isMissionOverview={displayedPhase.data === missionOverview}
              />
              <MissionCaptureButtons mission={missionOverview} />{' '}
              <Flex wrap={'wrap'} gap={'xs'} my={'xs'}>
                {displayedPhase.data.name !== missionOverview.name &&
                  displayedPhase.data?.actions?.map((uri) => (
                    <ActionsButton key={uri} uri={uri} />
                  ))}
                {missionOverview?.actions?.map((uri) => (
                  <ActionsButton key={uri} uri={uri} />
                ))}
              </Flex>
            </>
          ) : (
            <Text> No data for this time range </Text>
          )}
        </div>
      </Group>
    </Container>
  );
}
