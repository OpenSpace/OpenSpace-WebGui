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

// @TODO: (ylvse 2024-10-14) - This topic should be called something more specific.
// Refer to @emmbr for more details
export const cameraSlice = createSlice({
  name: 'camera',
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
