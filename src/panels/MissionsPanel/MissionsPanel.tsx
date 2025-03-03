import { Box, Select, Stack, Text, ThemeIcon, Title } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { RocketLaunchIcon } from '@/icons/icons';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setSelectedMission } from '@/redux/missions/missionsSlice';

import { MissionContent } from './MissionContent';

export function MissionsPanel() {
  const {
    isInitialized: hasMission,
    data,
    selectedMissionIdentifier
  } = useAppSelector((state) => state.missions);

  const luaApi = useOpenSpaceApi();
  const dispatch = useAppDispatch();

  let [mission] = data.missions;
  // If a new missions is added, the missions order might have changed so we try to find
  // the last one viewed
  if (hasMission && selectedMissionIdentifier) {
    const selectedMission = data.missions.find(
      (_mission) => _mission.identifier === selectedMissionIdentifier
    );
    if (selectedMission) {
      mission = selectedMission;
    }
  }

  function onMissionSelected(identifier: string | null) {
    if (!identifier) {
      return;
    }
    dispatch(setSelectedMission(identifier));
    luaApi?.setCurrentMission(identifier);
  }

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

  return (
    <Box>
      {data.missions.length > 1 && (
        <Select
          label={'Selected mission'}
          placeholder={'Select a mission'}
          data={data.missions.map((_mission) => {
            return { value: _mission.identifier, label: _mission.name };
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
