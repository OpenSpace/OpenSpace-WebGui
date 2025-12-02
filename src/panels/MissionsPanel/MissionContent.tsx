import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Group, Title } from '@mantine/core';

import { BoolInput } from '@/components/Input/BoolInput';
import { ScrollBox } from '@/components/ScrollBox/ScrollBox';
import { useSubscribeToTime } from '@/hooks/topicSubscriptions';

import { Timeline } from './Timeline/Timeline';
import { MissionPhase } from './MissionPhase';
import { DisplayedPhase, DisplayType, Phase } from './types';

interface Props {
  missionOverview: Phase;
}

export function MissionContent({ missionOverview }: Props) {
  const { t } = useTranslation('panel-missions', { keyPrefix: 'mission-content' });

  const [displayedPhase, setDisplayedPhase] = useState<DisplayedPhase>({
    type: DisplayType.Overview,
    data: missionOverview
  });
  const [displayCurrentPhase, setDisplayCurrentPhase] = useState(false);
  const [lastDisplayedPhase, setLastDisplayedPhase] = useState<DisplayedPhase>({
    type: undefined,
    data: undefined
  });

  // Reset phases when selected mission is changed
  useEffect(() => {
    // When the mission is changed, display overview again
    setDisplayedPhase({
      type: DisplayType.Overview,
      data: missionOverview
    });
    // Avoid potentially showing information from a previous mission
    setLastDisplayedPhase({
      type: DisplayType.Overview,
      data: missionOverview
    });
    setDisplayCurrentPhase(false);
  }, [missionOverview]);

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
    <Group wrap={'nowrap'} align={'start'} gap={'xs'}>
      <Timeline
        allPhasesNested={allPhasesNested}
        displayedPhase={displayedPhase}
        missionOverview={missionOverview}
        setDisplayedPhase={setPhaseManually}
      />
      <ScrollBox h={'100%'}>
        <Group justify={'space-between'} mb={'md'}>
          <Title order={2}>{missionOverview.name}</Title>
          <Button
            onClick={() =>
              setPhaseManually({ type: DisplayType.Overview, data: missionOverview })
            }
          >
            {t('overview')}
          </Button>
        </Group>
        <BoolInput
          label={t('display-current-mission-phase.label')}
          value={displayCurrentPhase}
          onChange={toggleCurrentPhase}
          info={t('display-current-mission-phase.tooltip')}
          mb={'xs'}
        />
        {displayedPhase.data ? (
          <MissionPhase
            displayedPhase={displayedPhase}
            missionOverview={missionOverview}
          />
        ) : (
          t('out-of-range-data')
        )}
      </ScrollBox>
    </Group>
  );
}
