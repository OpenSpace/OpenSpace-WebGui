import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export enum RecordingState {
  idle = 'idle',
  recording = 'recording',
  playing = 'playing',
  paused = 'playing-paused'
}

export interface SessionRecordingState {
  files: string[];
  state: RecordingState;
}

const initialState: SessionRecordingState = {
  files: [],
  state: RecordingState.idle
};

export const sessionRecordingSlice = createSlice({
  name: 'sessionRecording',
  initialState,
  reducers: {
    // Use `PayloadAction` to declare the contents of `action.payload`
    updateSessionrecording: (state, action: PayloadAction<SessionRecordingState>) => {
      state.files = action.payload.files;
      state.state = action.payload.state;
      return state;
    }
  }
});

// Action creators are generated for each case reducer function, replaces the `Actions/index.js`
export const { updateSessionrecording } = sessionRecordingSlice.actions;
export const sessionRecordingReducer = sessionRecordingSlice.reducer;
