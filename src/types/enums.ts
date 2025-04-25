// Collection of enums that in theory should be defined in a .tsx file, however this
// causes issues with fast refresh: https://nextjs.org/docs/architecture/fast-refresh

export enum IconSize {
  xs = 16,
  sm = 20,
  md = 26,
  lg = 32,
  xl = 42
}

export enum NavigationType {
  Jump,
  JumpGeo,
  Fly,
  FlyGeo,
  Focus,
  Frame
}

export enum ConnectionStatus {
  Connected = 'Connected',
  Connecting = 'Connecting',
  Disconnected = 'Disconnected'
}

export enum TimeStatus {
  Uninitialized = 'Uninitialized',
  OutsideRange = 'OutsideRange',
  Ok = 'Ok'
}

// This is not really an enum, but a collection of constants that need to be accessible
// using a string value. It serves a similar function, but we need the keys as strings.
// Did not find any better place for it, so putting it here for now. // emmbr, 2025-01-13
export const PropertyVisibilityNumber = {
  Hidden: 5,
  Developer: 4,
  AdvancedUser: 3,
  User: 2,
  NoviceUser: 1,
  Always: 0
};

export enum EngineMode {
  UserControl = 'user_control',
  SessionRecordingPlayback = 'session_recording_playback',
  CameraPath = 'camera_path'
}
