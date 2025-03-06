import { Box, Select, Stack, Text, ThemeIcon, Title } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { RocketLaunchIcon } from '@/icons/icons';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setSelectedMission } from '@/redux/missions/missionsSlice';

import { useSelectedMission } from './hooks';
import { MissionContent } from './MissionContent';

export function MissionsPanel() {
  const { data, selectedMissionIdentifier } = useAppSelector((state) => state.missions);

  const luaApi = useOpenSpaceApi();
  const { hasMission, mission } = useSelectedMission();
  const dispatch = useAppDispatch();

  function onMissionSelected(identifier: string | null) {
    if (!identifier) {
      return;
    }
    dispatch(setSelectedMission(identifier));
    luaApi?.setCurrentMission(identifier);
  }

  if (!hasMission || !mission) {
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

  return (
    <Box>
      {data.missions.length > 1 && (
        <Select
          label={'Selected mission'}
          placeholder={'Select a mission'}
          data={data.missions.map((mission) => {
            return { value: mission.identifier, label: mission.name };
          })}
          value={selectedMissionIdentifier}
          onChange={onMissionSelected}
          my={'xs'}
          allowDeselect={false}
        />
      )}
      <MissionContent missionOverview={mission} />
    </Box>
  );
}
