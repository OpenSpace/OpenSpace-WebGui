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
  jump,
  JumpGeo,
  fly,
  FlyGeo,
  focus,
  frame
}

export enum TimePart {
  Milliseconds = 'Milliseconds',
  Seconds = 'Seconds',
  Minutes = 'Minutes',
  Hours = 'Hours',
  Days = 'Days',
  Months = 'Months',
  Years = 'Years'
}

export enum DisplayType {
  Phase = 'Phase',
  Milestone = 'Milestone',
  Overview = 'Overview'
}
