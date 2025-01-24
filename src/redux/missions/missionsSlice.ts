import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Phase } from '@/types/mission-types';

export interface MissionState {
  isInitialized: boolean;
  data: { missions: Phase[] };
}

const initialState: MissionState = {
  isInitialized: false,
  data: {
    missions: []
  }
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
      return state;
    }
  }
});

// Action creators are generated for each case reducer function, replaces the `Actions/index.js`
export const { initializeMissions } = missionsSlice.actions;
export const missionsReducer = missionsSlice.reducer;
