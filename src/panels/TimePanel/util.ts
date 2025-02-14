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
