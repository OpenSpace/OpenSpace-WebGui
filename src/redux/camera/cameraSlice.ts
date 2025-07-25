import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CameraState {
  latitude: number | undefined;
  longitude: number | undefined;
  altitude: number | undefined;
  altitudeUnit: string | undefined;
  viewLatitude: number | undefined;
  viewLongitude: number | undefined;
  subSolarLatitude: number | undefined;
  subSolarLongitude: number | undefined;
  viewLength: number | undefined;
  altitudeMeters: number | undefined;
}

const initialState: CameraState = {
  latitude: undefined,
  longitude: undefined,
  altitude: undefined,
  altitudeUnit: undefined,
  viewLatitude: undefined,
  viewLongitude: undefined,
  subSolarLatitude: undefined,
  subSolarLongitude: undefined,
  viewLength: undefined,
  altitudeMeters: undefined
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
      state.viewLatitude = action.payload.viewLatitude;
      state.viewLongitude = action.payload.viewLongitude;
      state.subSolarLatitude = action.payload.subSolarLatitude;
      state.subSolarLongitude = action.payload.subSolarLongitude;
      state.viewLength = action.payload.viewLength;
      state.altitudeMeters = action.payload.altitudeMeters;
      return state;
    }
  }
});

// Action creators are generated for each case reducer function, replaces the `Actions/index.js`
export const { updateCamera } = cameraSlice.actions;
export const cameraReducer = cameraSlice.reducer;
