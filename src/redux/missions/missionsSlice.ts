import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Missions, Phase } from '@/panels/MissionsPanel/types';

export interface MissionState {
  isInitialized: boolean;
  missions: Missions;
  selectedMissionIdentifier: string;
}

const initialState: MissionState = {
  isInitialized: false,
  missions: {},
  selectedMissionIdentifier: ''
};

function makeUTCString(time: string): string {
  return time.includes('Z') ? time : `${time}Z`;
}

function convertPhaseToUTC(phase: Phase): Phase {
  return {
    ...phase,
    timerange: {
      start: makeUTCString(phase.timerange.start),
      end: makeUTCString(phase.timerange.end)
    },
    // Recursively convert nested phases
    phases: phase.phases.map(convertPhaseToUTC),
    // Convert capturetimes array
    capturetimes: phase.capturetimes?.map(makeUTCString),
    // Convert milestone dates
    milestones: phase.milestones.map((milestone) => ({
      ...milestone,
      date: makeUTCString(milestone.date)
    }))
  };
}

export const missionsSlice = createSlice({
  name: 'missions',
  initialState,
  reducers: {
    initializeMissions: (state, action: PayloadAction<Missions>) => {
      // Empty the existing map so that we don't keep removed missions in redux state
      state.missions = {};
      state.isInitialized = true;

      Object.entries(action.payload).map(([identifier, mission]) => {
        state.missions[identifier] = convertPhaseToUTC(mission);
      });

      // If no mission was loaded or if the previously selected mission was removed,
      // automatically select first available mission from the updated list if one exists
      const isSelectedMissionLoaded = state.selectedMissionIdentifier in state.missions;
      if (!isSelectedMissionLoaded) {
        state.selectedMissionIdentifier = Object.keys(state.missions)[0] ?? '';
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

// Action creators are generated for each case reducer function, replaces the `Actions/index.js`
export const { initializeMissions, clearMissions, setSelectedMission } =
  missionsSlice.actions;
export const missionsReducer = missionsSlice.reducer;
