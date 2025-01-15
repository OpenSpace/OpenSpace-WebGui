import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface FlightControlState {
  isEnabled: boolean;
  inputScaleFactor: number;
}

const initialState: FlightControlState = {
  isEnabled: false,
  inputScaleFactor: 0.55
};

export const flightControllerSlice = createSlice({
  name: 'flightController',
  initialState,
  reducers: {
    setFlightControllerEnabled: (state, action: PayloadAction<boolean>) => {
      state.isEnabled = action.payload;
      return state;
    },
    setFlightControllerInputScaleFactor: (state, action: PayloadAction<number>) => {
      state.inputScaleFactor = action.payload;
      return state;
    }
  }
});

export const { setFlightControllerEnabled, setFlightControllerInputScaleFactor } =
  flightControllerSlice.actions;

export const flightControllerReducer = flightControllerSlice.reducer;
