import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CameraState {
  latitude: number | undefined;
  longitude: number | undefined;
  altitude: number | undefined;
  altitudeUnit: string | undefined;
}

const initialState: CameraState = {
  latitude: undefined,
  longitude: undefined,
  altitude: undefined,
  altitudeUnit: undefined
};

export const cameraSlice = createSlice({
  name: 'connection',
  initialState,
  reducers: {
    updateCamera: (state, action: PayloadAction<CameraState>) => {
      state.altitude = action.payload.altitude;
      state.latitude = action.payload.latitude;
      state.longitude = action.payload.longitude;
      state.altitudeUnit = action.payload.altitudeUnit;
    }
  }
});

// Action creators are generated for each case reducer function, replaces the `Actions/index.js`
export const { updateCamera } = cameraSlice.actions;
export const cameraReducer = cameraSlice.reducer;
