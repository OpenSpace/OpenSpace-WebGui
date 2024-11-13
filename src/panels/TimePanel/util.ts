import { TimePart } from '@/types/enums';

export const StepSizes = {
  [TimePart.Milliseconds]: 1,
  [TimePart.Seconds]: 1,
  [TimePart.Minutes]: 60,
  [TimePart.Hours]: 3600,
  [TimePart.Date]: 86400,
  [TimePart.Month]: 2678400,
  [TimePart.Year]: 31536000
};

export const Decimals = {
  [TimePart.Milliseconds]: 0,
  [TimePart.Seconds]: 0,
  [TimePart.Minutes]: 3,
  [TimePart.Hours]: 4,
  [TimePart.Date]: 5,
  [TimePart.Month]: 7,
  [TimePart.Year]: 10
};
