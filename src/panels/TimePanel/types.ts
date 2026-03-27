export enum TimePart {
  Milliseconds = 'Milliseconds',
  Seconds = 'Seconds',
  Minutes = 'Minutes',
  Hours = 'Hours',
  Days = 'Days',
  Months = 'Months',
  Years = 'Years'
}

export const StepSizes = {
  [TimePart.Milliseconds]: 0.001,
  [TimePart.Seconds]: 1,
  [TimePart.Minutes]: 60,
  [TimePart.Hours]: 3600,
  [TimePart.Days]: 86400,
  [TimePart.Months]: 2628000,
  [TimePart.Years]: 31536000
};

export const Decimals = {
  [TimePart.Milliseconds]: 0,
  [TimePart.Seconds]: 1,
  [TimePart.Minutes]: 3,
  [TimePart.Hours]: 4,
  [TimePart.Days]: 5,
  [TimePart.Months]: 7,
  [TimePart.Years]: 10
};
