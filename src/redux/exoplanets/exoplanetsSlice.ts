import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ExoplanetData } from 'src/types/types';

export interface ExoplanetState {
  isInitialized: boolean;
  data: ExoplanetData[];
}

const initialState: ExoplanetState = {
  isInitialized: false,
  data: []
};

export const exoplanetsSlice = createSlice({
  name: 'exoplanets',
  initialState,
  reducers: {
    initializeExoplanets: (_, action: PayloadAction<ExoplanetData[]>) => {
      return {
        isInitialized: true,
        data: action.payload
      };
    }
  }
});

// Action creators are generated for each case reducer function, replaces the `Actions/index.js`
export const { initializeExoplanets } = exoplanetsSlice.actions;
export const connectionReducer = exoplanetsSlice.reducer;
