import { Container, Text } from '@mantine/core';

import { useAppSelector } from '@/redux/hooks';

import { DisplayType } from '@/types/enums';
import { Milestone, Phase } from '@/types/mission-types';
import { MissionContent } from './MissionContent';

export type DisplayedPhase =
  | { type: DisplayType.Phase; data: Phase }
  | { type: DisplayType.Milestone; data: Milestone }
  | { type: undefined; data: undefined };

export function MissionsPanel() {
  const hasMission = useAppSelector((state) => state.missions.isInitialized);
  const mission = useAppSelector((state) => state.missions.data.missions[0]);

  return (
    <Container my={'xs'}>
      {hasMission ? (
        <MissionContent missionOverview={mission} />
      ) : (
        <Text>No mission loaded</Text>
      )}
    </Container>
  );
}
