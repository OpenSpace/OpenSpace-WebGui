export enum RecordingState {
  Idle = 'idle',
  Recording = 'recording',
  Playing = 'playing',
  Paused = 'playing-paused'
}

export interface SessionRecordingSettings {
  recordingFileName: string;
  format: 'Ascii' | 'Binary';
  overwriteFile: boolean;
  latestFile: string;
  hideGuiOnPlayback: boolean;
}
