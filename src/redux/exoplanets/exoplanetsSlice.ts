import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { loadExoplanetsData } from './exoplanetsMiddleware';

export interface ExoplanetState {
  isInitialized: boolean;
  data: string[];
}

const initialState: ExoplanetState = {
  isInitialized: false,
  data: []
};

export const exoplanetsSlice = createSlice({
  name: 'exoplanets',
  initialState,
  reducers: {
    initializeExoplanets: (_, action: PayloadAction<string[]>) => {
      return {
        isInitialized: true,
        data: action.payload
      };
    }
  },
  extraReducers: (builder) => {
    builder.addCase(loadExoplanetsData.fulfilled, (state, action) => {
      if (action.payload) {
        state.isInitialized = true;
        state.data = Object.values(action.payload);
      }
      return state;
    });
  }
});

// Action creators are generated for each case reducer function, replaces the `Actions/index.js`
export const { initializeExoplanets } = exoplanetsSlice.actions;
export const exoplanetsReducer = exoplanetsSlice.reducer;
