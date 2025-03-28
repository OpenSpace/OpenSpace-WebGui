import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import {
  RecordingState,
  SessionRecordingSettings
} from '@/panels/SessionRecordingPanel/types';

export interface SessionRecordingState {
  files: string[];
  state: RecordingState;
  settings: SessionRecordingSettings;
}

const initialState: SessionRecordingState = {
  files: [],
  state: RecordingState.Idle,
  settings: {
    recordingFileName: '',
    format: 'Ascii',
    overwriteFile: false
  }
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
    },
    updateSessionRecordingSettings: (
      state,
      action: PayloadAction<Partial<SessionRecordingSettings>>
    ) => {
      const { format, recordingFileName: filename, overwriteFile } = action.payload;
      if (format !== undefined) {
        state.settings.format = format;
      }
      if (filename !== undefined) {
        state.settings.recordingFileName = filename;
      }
      if (overwriteFile !== undefined) {
        state.settings.overwriteFile = overwriteFile;
      }
      return state;
    }
  }
});

// Action creators are generated for each case reducer function, replaces the `Actions/index.js`
export const { updateSessionrecording, updateSessionRecordingSettings } =
  sessionRecordingSlice.actions;
export const sessionRecordingReducer = sessionRecordingSlice.reducer;
