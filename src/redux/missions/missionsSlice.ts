import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MissionEntry, MissionMap, MissionPhase } from 'openspace-api-js/types';

export interface MissionState {
  isInitialized: boolean;
  missions: MissionMap;
  selectedMissionIdentifier: string;
}

const initialState: MissionState = {
  isInitialized: false,
  missions: {},
  selectedMissionIdentifier: ''
};

function convertMissionToUTC(missionEntry: MissionEntry): MissionEntry {
  // Convert captureTimes array
  const captureTimes = missionEntry.captureTimes.map(makeUTCString);

  // Recursively convert phases to UTC dates
  const mission = convertPhaseToUTC(missionEntry.mission);

  function makeUTCString(time: string): string {
    return time.includes('Z') ? time : `${time}Z`;
  }

  function convertPhaseToUTC(phase: MissionPhase): MissionPhase {
    return {
      ...phase,
      timerange: {
        start: makeUTCString(phase.timerange.start),
        end: makeUTCString(phase.timerange.end)
      },
      // Recursively convert nested phases
      phases: phase.phases.map(convertPhaseToUTC),
      // Convert milestone dates
      milestones: phase.milestones.map((milestone) => ({
        ...milestone,
        date: makeUTCString(milestone.date)
      }))
    };
  }

  return {
    captureTimes,
    mission
  };
}

export const missionsSlice = createSlice({
  name: 'missions',
  initialState,
  reducers: {
    initializeMissions: (state, action: PayloadAction<MissionMap>) => {
      // Empty the existing map so that we don't keep removed missions in redux state
      state.missions = {};
      state.isInitialized = true;

      Object.entries(action.payload).forEach(([identifier, mission]) => {
        state.missions[identifier] = convertMissionToUTC(mission);
      });

      // If no mission was loaded or if the previously selected mission was removed,
      // automatically select last available mission from the updated list if one exists
      const isSelectedMissionLoaded = state.selectedMissionIdentifier in state.missions;
      if (!isSelectedMissionLoaded) {
        state.selectedMissionIdentifier = Object.keys(state.missions).at(-1) ?? '';
      }

      return state;
    },
    clearMissions: (state) => {
      state.isInitialized = false;
      state.missions = {};
      state.selectedMissionIdentifier = '';
      return state;
    },
    setSelectedMission: (state, action: PayloadAction<string>) => {
      state.selectedMissionIdentifier = action.payload;
      return state;
    }
  }
});

export const { initializeMissions, clearMissions, setSelectedMission } =
  missionsSlice.actions;
export const missionsReducer = missionsSlice.reducer;
