import { SessionRecordingPlaybackData } from 'openspace-api-js/types';

export interface SessionRecordingSettings {
  recordingFilename: string;
  format: SessionRecordingFormat;
  overwriteFile: boolean;
  latestFile: string;
  hideGuiOnPlayback: boolean;
  hideDashboardsOnPlayback: boolean;
  latestPlaybackEvent: PlaybackEvent;
}

export type SessionRecordingFormat = 'Ascii' | 'Binary';
export type SessionRecordingExtension = '.osrectxt' | '.osrec';
export type PlaybackEvent = SessionRecordingPlaybackData['state'] | 'Uninitialized';
