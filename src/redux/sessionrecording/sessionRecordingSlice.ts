import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import {
  PlaybackEvent,
  RecordingState,
  SessionRecordingExtension,
  SessionRecordingSettings
} from '@/panels/SessionRecordingPanel/types';

export interface SessionRecordingState {
  files: string[];
  state: RecordingState;
  settings: SessionRecordingSettings;
  initialSettings: {
    showGui: boolean;
    showDashboards: boolean;
    showLog: boolean;
    showVersion: boolean;
  };
}

const initialState: SessionRecordingState = {
  files: [],
  state: RecordingState.Idle,
  settings: {
    recordingFilename: '',
    format: 'Ascii',
    overwriteFile: false,
    latestFile: '',
    hideGuiOnPlayback: false,
    hideDashboardsOnPlayback: false,
    latestPlaybackEvent: 'Uninitialized'
  },
  initialSettings: {
    showGui: true,
    showDashboards: true,
    showLog: true,
    showVersion: true
  }
};

export const sessionRecordingSlice = createSlice({
  name: 'sessionRecording',
  initialState,
  reducers: {
    updateSessionrecording: (state, action: PayloadAction<SessionRecordingState>) => {
      const validExtensions: SessionRecordingExtension[] = ['.osrec', '.osrectxt'];
      // Filter files that only have a valid session recording extension
      state.files = action.payload.files.filter((file) =>
        validExtensions.some((ext) => file.endsWith(ext))
      );
      state.state = action.payload.state;
      return state;
    },
    updateSessionRecordingSettings: (
      state,
      action: PayloadAction<Partial<SessionRecordingSettings>>
    ) => {
      const {
        format,
        recordingFilename: filename,
        overwriteFile,
        latestFile,
        hideGuiOnPlayback,
        hideDashboardsOnPlayback
      } = action.payload;
      if (format !== undefined) {
        state.settings.format = format;
      }
      if (filename !== undefined) {
        state.settings.recordingFilename = filename;
      }
      if (overwriteFile !== undefined) {
        state.settings.overwriteFile = overwriteFile;
      }
      if (latestFile) {
        state.settings.latestFile = latestFile;
      }
      if (hideGuiOnPlayback !== undefined) {
        state.settings.hideGuiOnPlayback = hideGuiOnPlayback;
      }
      if (hideDashboardsOnPlayback !== undefined) {
        state.settings.hideDashboardsOnPlayback = hideDashboardsOnPlayback;
      }
      return state;
    },
    updateSessionRecordingPlaybackEvent: (
      state,
      action: PayloadAction<PlaybackEvent>
    ) => {
      state.settings.latestPlaybackEvent = action.payload;
      return state;
    },
    updateInitialRecordingSettings: (
      state,
      action: PayloadAction<{
        showGui: boolean;
        showDashboards: boolean;
        showLog: boolean;
        showVersion: boolean;
      }>
    ) => {
      state.initialSettings = action.payload;
    }
  }
});

// Action creators are generated for each case reducer function, replaces the `Actions/index.js`
export const {
  updateSessionrecording,
  updateSessionRecordingSettings,
  updateSessionRecordingPlaybackEvent,
  updateInitialRecordingSettings
} = sessionRecordingSlice.actions;
export const sessionRecordingReducer = sessionRecordingSlice.reducer;
