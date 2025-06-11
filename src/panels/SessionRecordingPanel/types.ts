import { SessionRecordingPlaybackEvent } from '@/redux/events/types';

export enum RecordingState {
  Idle = 'idle',
  Recording = 'recording',
  Playing = 'playing',
  Paused = 'playing-paused'
}

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
export type PlaybackEvent = SessionRecordingPlaybackEvent['State'] | 'Uninitialized';
