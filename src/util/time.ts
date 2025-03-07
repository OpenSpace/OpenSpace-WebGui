export function dateToOpenSpaceTimeString(date: Date): string {
  // Spice, which is handling the time parsing in OpenSpace does not support
  // ISO 8601-style time zones (the Z). It does, however, always assume that UTC
  // is given.

  const year = date.getUTCFullYear();
  let dateString = date.toJSON().replace('Z', '');

  if (year >= 100) {
    // For years > 10 000 the JSON string includes a '+' which mess up the OpenSpace
    // interpretation of the value so we remove it here as well
    return dateString.replace('+', '');
  } else {
    // Remove first '-' from negative years to be able to split it
    if (dateString.startsWith('-')) {
      dateString = dateString.substring(1);
    }

    const [utcYear, month, rest] = dateString.split('-');
    // With the epoch formats e.g., YYYY A.D. MM DD HH:MM:SS we can't have the 'T' token
    const [day, time] = rest.split('T');

    // Spice assumes that years between 0-68 are abbreviation of 2000-2068 and 69-99 are
    // abbreviation of 1969-1999, we assume people mean the actual year
    // (e.g., 68 means year 68 not 2068) so we send the date with an epoch as well.
    // https://naif.jpl.nasa.gov/pub/naif/toolkit_docs/C/cspice/str2et_c.html
    if (year > 0 && year < 100) {
      return `${utcYear} A.D. ${month} ${day} ${time}`;
    }
    // For negative years we have to parse the string in B.C. epoch format for spice.
    // https://naif.jpl.nasa.gov/pub/naif/toolkit_docs/C/cspice/str2et_c.html
    else {
      // (year <= 0)
      const parsedUtcYear = parseInt(utcYear);

      // A.D - B.C years does not have year 0 so we shift B.C by one. From str2et_c examples:
      // The following date: 18 B.C. Jun 3, 12:29:28.291 becomes -017 Jun 03 12 29 28.291

      // @TODO (anden88 2025-02-27): *Something* happens between 999 and 1001 BC where
      // Spice maps 1000 BC to 999 BC and 1001 BC to 1001 BC. This change in behaviour also
      // means that stepping up and down  with the buttons would increment/decrement by 2.
      // So then we don't want to add the shift. This however leads to not being able to
      // shift-click the increment at year 1001 BC
      const shouldShift = parsedUtcYear <= 1000;
      const shiftedUtcYear = shouldShift ? parsedUtcYear + 1 : parsedUtcYear;

      return `${shiftedUtcYear} B.C. ${month} ${day} ${time}`;
    }
  }
}
