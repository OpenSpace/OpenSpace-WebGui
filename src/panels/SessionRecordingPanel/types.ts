import { SessionRecordingPlaybackEvent } from '@/redux/events/types';

export enum RecordingState {
  Idle = 'idle',
  Recording = 'recording',
  Playing = 'playing',
  Paused = 'playing-paused'
}

export interface SessionRecordingSettings {
  recordingFileName: string;
  format: SessionRecordingFormat;
  overwriteFile: boolean;
  latestFile: string;
  hideGuiOnPlayback: boolean;
  hideDashboardsOnPlayback: boolean;
  latestPlaybackEvent: PlaybackEvent;
}

export type SessionRecordingFormat = 'Ascii' | 'Binary';
export type PlaybackEvent = SessionRecordingPlaybackEvent['State'] | 'Uninitialized';
