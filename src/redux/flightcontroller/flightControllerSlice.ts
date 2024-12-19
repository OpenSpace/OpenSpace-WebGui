import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface FlightControlState {
  settings: {
    isEnabled: boolean;
    inputScaleFactor: number;
  };
}

const initialState: FlightControlState = {
  settings: {
    isEnabled: false,
    inputScaleFactor: 0.55
  }
};

export const flightControllerSlice = createSlice({
  name: 'flightController',
  initialState,
  reducers: {
    setSettings: (
      state,
      action: PayloadAction<{
        isEnabled?: boolean;
        inputscaleFactor?: number;
      }>
    ) => {
      const { isEnabled, inputscaleFactor } = action.payload;
      if (isEnabled !== undefined) {
        state.settings.isEnabled = isEnabled;
      }
      if (inputscaleFactor !== undefined) {
        state.settings.inputScaleFactor = inputscaleFactor;
      }

      return state;
    }
  }
});

export const { setSettings } = flightControllerSlice.actions;

export const flightControllerReducer = flightControllerSlice.reducer;
