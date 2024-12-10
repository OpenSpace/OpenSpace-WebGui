import { Container, Text } from '@mantine/core';

import { useAppSelector } from '@/redux/hooks';

import { MissionContent } from './MissionContent';

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
