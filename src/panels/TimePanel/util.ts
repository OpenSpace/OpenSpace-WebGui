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

export function setDate(luaApi: OpenSpace.openspace | null, newTime: Date) {
  // Spice, that is handling the time parsing in OpenSpace does not support
  // ISO 8601-style time zones (the Z). It does, however, always assume that UTC
  // is given.
  // For years > 10 000 the JSON string includes a '+' which mess up the OpenSpace
  // interpretation of the value so we remove it here. TODO: send milliseconds/seconds pls
  const fixedTimeString = newTime.toJSON().replace('Z', '').replace('+', '');
  // TODO: when we have negative years the date string must be formatted correctly for
  // OpenSpace to understand, haven't found a working string yet (anden88 2024-11-08),
  // its possible we must "reparse" the string back to B.C. YYYY MMM ...
  luaApi?.time.setTime(fixedTimeString);
}
