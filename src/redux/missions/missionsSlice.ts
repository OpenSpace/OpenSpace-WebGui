import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Phase } from '@/panels/MissionsPanel/types';

export interface MissionState {
  isInitialized: boolean;
  data: { missions: Phase[] };
  selectedMissionIdentifier: string;
}

const initialState: MissionState = {
  isInitialized: false,
  data: {
    missions: []
  },
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
    initializeMissions: (state, action: PayloadAction<{ missions: Phase[] }>) => {
      state.isInitialized = true;
      state.data.missions = action.payload.missions.map(convertPhaseToUTC);

      // If no mission was loaded or if the previously selected mission was removed,
      // automatically select first available mission from the updated list
      const isSelectedMissionLoaded = state.data.missions.some(
        (mission) => mission.identifier === state.selectedMissionIdentifier
      );
      if (!isSelectedMissionLoaded) {
        state.selectedMissionIdentifier = action.payload.missions[0].identifier;
      }
      return state;
    },
    clearMissions: (state) => {
      state.isInitialized = false;
      state.data.missions = [];
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
