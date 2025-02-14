import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface CameraPathState {
  target: string;
  remainingTime: number;
  isPaused: boolean;
}

const initialState: CameraPathState = {
  target: '',
  remainingTime: 0,
  isPaused: false
};

export const cameraPathSlice = createSlice({
  name: 'cameraPath',
  initialState,
  reducers: {
    updateCameraPath: (state, action: PayloadAction<CameraPathState>) => {
      state = action.payload;
      return state;
    }
  }
});

export const { updateCameraPath } = cameraPathSlice.actions;
export const cameraPathReducer = cameraPathSlice.reducer;
