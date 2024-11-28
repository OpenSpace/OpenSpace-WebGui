import { useEffect, useRef, useState } from 'react';
import { Button, Container, Group, Image, Text } from '@mantine/core';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { subscribeToTime, unsubscribeToTime } from '@/redux/time/timeMiddleware';
import { Milestone, Phase } from '@/types/mission-types';
import { DisplayType } from '@/types/enums';
import { TimeButtons } from './TimeButtons';

type DisplayedPhase =
  | { type: DisplayType.Phase; data: Phase }
  | { type: DisplayType.Milestone; data: Milestone }
  | { type: undefined; data: undefined };

export function MissionsPanel() {
  const dispatch = useAppDispatch();
  const missions = useAppSelector((state) => state.missions.data.missions);
  const [selectedMisssion] = missions;

  // TODO check what happens if we dont have any missions
  const overview = useAppSelector((state) => state.missions.data.missions[0]);
  const [displayedPhase, setDisplayedPhase] = useState<DisplayedPhase>({
    type: DisplayType.Phase,
    data: overview
  });
  const [displayCurrentPhase, setDisplayCurrentPhase] = useState(false);
  const now = useAppSelector((state) => state.time.timeCapped);
  const allPhasesNested = useRef<Phase[][]>([]);

  const title = getTitle();
  const timeString = getTimeString();

  useEffect(() => {
    dispatch(subscribeToTime());

    return () => {
      dispatch(unsubscribeToTime());
    };
  }, [dispatch]);

  // When mission is changed update the phases
  useEffect(() => {
    const phases = findAllPhases();
    allPhasesNested.current = phases;
  }, [selectedMisssion, findAllPhases]);

  // Keep current mission phase up-to-date with time, to get automatic switching as we
  // move in time
  useEffect(() => {
    if (displayCurrentPhase) {
      setPhaseToCurrent();
    }
  }, [now, displayCurrentPhase]);

  function getTitle() {
    // Hide title if the overview is currently shown
    const isShowingOverview = displayedPhase.data?.name === overview.name;
    const hasType = displayedPhase.type;
    const hideTile = isShowingOverview || !hasType;
    return hideTile ? '' : `${displayedPhase.type}: ${displayedPhase.data?.name}`;
  }

  function getTimeString() {
    switch (displayedPhase.type) {
      case DisplayType.Phase:
        const start = new Date(
          makeUTCString(displayedPhase.data.timerange.start)
        ).toDateString();
        const end = new Date(
          makeUTCString(displayedPhase.data.timerange.end)
        ).toDateString();
        return `${start} - ${end}`;
      case DisplayType.Milestone:
        return new Date(makeUTCString(displayedPhase.data.date)).toDateString();
      default:
        return '';
    }
  }

  function setPhaseManually(phase: DisplayedPhase) {
    setDisplayedPhase(phase);
    setDisplayCurrentPhase(false);
  }

  function findAllPhases() {
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

    collectPhases(selectedMisssion.phases);

    return phasesByDepth;
  }

  function setPhaseToCurrent() {
    if (now === undefined) {
      console.error('now is not available');
      return;
    }

    const allPhasesFlat = allPhasesNested.current.flat();
    const filteredPhases = allPhasesFlat.filter((phase) => {
      const isBeforeEnd = now < Date.parse(makeUTCString(phase.timerange.end));
      const isAfterStart = now >= Date.parse(makeUTCString(phase.timerange.start));
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

  function makeUTCString(time: string) {
    return time.includes('Z') ? time : `${time}Z`;
  }

  return (
    <Container my={'xs'}>
      <Group grow gap={'xs'}>
        <Button
          onClick={() => setPhaseManually({ type: DisplayType.Phase, data: overview })}
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
          <Text>{title}</Text>
          <Text c={'dimmed'}>{timeString}</Text>
          <Text my={'xs'}>{displayedPhase.data.description}</Text>
          {displayedPhase.data.link && (
            <Button onClick={() => console.log(displayedPhase.data.link)}>
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
          <TimeButtons
            displayType={displayedPhase.type}
            isMissionOverview={displayedPhase.data === overview}
          />
        </>
      ) : (
        <Text> No data for this time range </Text>
      )}
    </Container>
  );
}
