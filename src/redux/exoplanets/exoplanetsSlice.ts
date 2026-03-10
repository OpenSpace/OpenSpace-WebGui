import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
  }
});

export const { initializeExoplanets } = exoplanetsSlice.actions;
export const exoplanetsReducer = exoplanetsSlice.reducer;
