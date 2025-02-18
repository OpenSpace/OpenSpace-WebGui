import { CloseIcon, Stack, Text, ThemeIcon, Title } from '@mantine/core';

import { RocketLaunchIcon } from '@/icons/icons';
import { useAppSelector } from '@/redux/hooks';

import { MissionContent } from './MissionContent';

export function MissionsPanel() {
  const hasMission = useAppSelector((state) => state.missions.isInitialized);
  const mission = useAppSelector((state) => state.missions.data.missions[0]);

  if (!hasMission) {
    return (
      <Stack h={'100%'} w={'100%'} ta={'center'} align={'center'} p={'lg'}>
        <Title order={2}>No mission loaded</Title>
        <Text c={'dimmed'}>
          Open an asset that contains a mission, or load a mission profile.
        </Text>
        <ThemeIcon size={100} variant={'transparent'}>
          <RocketLaunchIcon size={'100px'} />
        </ThemeIcon>
      </Stack>
    );
  }

  return <MissionContent missionOverview={mission} />;
}
