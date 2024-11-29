import { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Container, Flex, Group, Image, Text } from '@mantine/core';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { subscribeToTime, unsubscribeToTime } from '@/redux/time/timeMiddleware';
import { DisplayType } from '@/types/enums';
import { Milestone, Phase } from '@/types/mission-types';
import { Action } from '@/types/types';

import { ActionsButton } from '../ActionsPanel/ActionsButton';

import { MissionCaptureButtons } from './MissionCaptureButtons';
import { MissionTimeButtons } from './MissionTimeButtons';
import { makeUTCString } from './util';

export type DisplayedPhase =
  | { type: DisplayType.Phase; data: Phase }
  | { type: DisplayType.Milestone; data: Milestone }
  | { type: undefined; data: undefined };

export function MissionsPanel() {
  const dispatch = useAppDispatch();
  const missions = useAppSelector((state) => state.missions.data.missions);
  const [selectedMisssion] = missions;

  const allActions = useAppSelector((state) => state.actions.actions);
  // TODO check what happens if we dont have any missions
  const overview = useAppSelector((state) => state.missions.data.missions[0]);
  const [displayedPhase, setDisplayedPhase] = useState<DisplayedPhase>({
    type: DisplayType.Phase,
    data: overview
  });
  const [displayCurrentPhase, setDisplayCurrentPhase] = useState(false);
  const [currentActions, setCurrentActions] = useState<Action[]>([]);
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

  const findAllPhases = useCallback(() => {
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
  }, [selectedMisssion]);

  // When mission is changed update the phases
  useEffect(() => {
    const phases = findAllPhases();
    allPhasesNested.current = phases;
  }, [selectedMisssion, findAllPhases]);

  const setPhaseToCurrent = useCallback(() => {
    if (now === undefined) {
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
  }, [now, displayedPhase]);

  // Keep current mission phase up-to-date with time, to get automatic switching as we
  // move in time
  useEffect(() => {
    if (displayCurrentPhase) {
      setPhaseToCurrent();
    }
  }, [now, displayCurrentPhase, setPhaseToCurrent]);

  // Whenever a phase changes, we want to get the actions that are valid for that phase
  useEffect(() => {
    function findCurrentActions(phase: Phase | Milestone, allActions: Action[]) {
      return phase
        .actions!.map((uri) => allActions.find((action) => action.identifier === uri))
        .filter((v) => v !== undefined);
    }

    // We want to add any actions related to the whole mission
    const phasesToCheck: (Phase | Milestone)[] = [overview];

    // Add any extra actions related to the currently shown phase or milestone
    if (
      displayedPhase.data &&
      displayedPhase.data.actions &&
      displayedPhase.data !== overview
    ) {
      phasesToCheck.push(displayedPhase.data);
    }

    const result = phasesToCheck.flatMap((phase) =>
      findCurrentActions(phase, allActions)
    );

    setCurrentActions(result);
  }, [allActions, displayedPhase, overview]);

  function getTitle() {
    // Hide title if the overview is currently shown
    const isShowingOverview = displayedPhase.data?.name === overview.name;
    const hasType = displayedPhase.type;
    const hideTile = isShowingOverview || !hasType;
    return hideTile ? '' : `${displayedPhase.type}: ${displayedPhase.data?.name}`;
  }

  function getTimeString() {
    switch (displayedPhase.type) {
      case DisplayType.Phase: {
        const start = new Date(
          makeUTCString(displayedPhase.data.timerange.start)
        ).toDateString();
        const end = new Date(
          makeUTCString(displayedPhase.data.timerange.end)
        ).toDateString();
        return `${start} - ${end}`;
      }
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
          <MissionTimeButtons
            currentPhase={displayedPhase}
            isMissionOverview={displayedPhase.data === overview}
          />
          <MissionCaptureButtons mission={selectedMisssion} />{' '}
          <Flex wrap={'wrap'} gap={'xs'} my={'xs'}>
            {currentActions.map((action) => (
              <ActionsButton key={action.identifier} action={action} />
            ))}
          </Flex>
        </>
      ) : (
        <Text> No data for this time range </Text>
      )}
    </Container>
  );
}
