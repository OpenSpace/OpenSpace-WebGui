import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Phase } from '@/types/mission-types';

export interface ExoplanetState {
  isInitialized: boolean;
  data: { missions: Phase[] };
}

const initialState: ExoplanetState = {
  isInitialized: false,
  data: {
    missions: []
  }
};

export const missionsSlice = createSlice({
  name: 'missions',
  initialState,
  reducers: {
    initializeMissions: (state, action: PayloadAction<{ missions: Phase[] }>) => {
      state.isInitialized = true;
      state.data = action.payload;
      return state;
    }
  }
});

// Action creators are generated for each case reducer function, replaces the `Actions/index.js`
export const { initializeMissions } = missionsSlice.actions;
export const missionsReducer = missionsSlice.reducer;
