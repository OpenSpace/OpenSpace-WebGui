function monthToNumber(month: string) {
  // Dictionary to map month abbreviations to their corresponding two-digit numbers
  const monthMapping: { [key: string]: string } = {
    JAN: '01',
    FEB: '02',
    MAR: '03',
    APR: '04',
    MAY: '05',
    JUN: '06',
    JUL: '07',
    AUG: '08',
    SEP: '09',
    OCT: '10',
    NOV: '11',
    DEC: '12'
  };
  // TODO: we should not recieve anything else but if that were to happen, what should
  // default behaviour be?
  return monthMapping[month] || '';
}
function parseNegativeYears(date: string) {
  // Remove first dash so we can split it where the year ends
  const unsignedDate = date.substring(1);
  // Get the year by searching for first '-'
  const unsignedYear = unsignedDate.substring(0, unsignedDate.indexOf('-'));
  // Create year for the pattern '-00YYYY' for negative years (see link above)
  const filledYear = `-${unsignedYear.padStart(6, '0')}`;
  // Get everything after the year
  const rest = unsignedDate.substring(unsignedDate.indexOf('-'));
  return filledYear.concat(rest);
}

function parseBCYears(date: string) {
  // Year < 1000 B.C have a different format, B.C. YYYY MM DD HH:MM:SSS
  // Due to the fixed length of the string we get from OpenSpace, we might also be
  // missing information regarding hh:mm:ss for example:
  // "B.C. 202969 JAN 09 16:5" and  "B.C. 3693 JUL 19 17:29:"

  // If we are unable to get month and day from the string chances are that the date is
  // very far back in the past and that the month, day, and time is kind of meaningless
  // We build a fake date that atleast uses the correct year to display *something*
  const [, unsignedYear, month, day] = date.split(' ');
  if (!unsignedYear) {
    // We failed to parse the year, return an invalid date
    return '';
  }
  const monthNumber = monthToNumber(month);
  // Create year for the pattern '-00YYYY' for negative years (see link above)
  const filledYear = `-${unsignedYear.padStart(6, '0')}`;
  // Build the string to correct format ignoring the time since that information might
  // be broken anyways.
  return `${filledYear}-${monthNumber ?? '01'}-${day ?? '01'}T00:00:00.000`;
}

function parseJ2000Date(date: string, yearIndex: number) {
  // Year is in the range (0,9999)
  const year = date.substring(0, yearIndex);
  const rest = date.substring(yearIndex);
  const filledYear = year.padStart(4, '0');
  return filledYear.concat(rest);
}
function parseLargeADYears(date: string) {
  // Year is above 10.000 A.D. and we have yet another format from OpenSpace as follows:
  // YYYY MMM DD HH:MM:SS.xxx
  const [year, month, day, time] = date.split(' ');
  const [hours, minutes, seconds] = time.split(/[:.]/);
  const monthNumber = monthToNumber(month);
  // For `Date` to correctly parse we need to append '+' and leading zeros
  const filledYear = year.padStart(6, '0');
  // We ignore milliseconds as those are most likely cut anyways
  return `+${filledYear}-${monthNumber ?? '01'}-${day ?? '01'}T${hours ?? '00'}:${minutes ?? '00'}:${seconds ?? '00'}.000`;
}

// Using this hack to parse times
// https://scholarslab.lib.virginia.edu/blog/parsing-bc-dates-with-javascript/
export function dateStringWithTimeZone(date: string, zone = 'Z') {
  // Ensure we don't have white spaces
  const whitespaceRemoved = date.replace(/\s/g, '');
  let result: string;
  // If we are in negative years (before year 0)
  if (whitespaceRemoved[0] === '-') {
    result = parseNegativeYears(whitespaceRemoved);
  } else if (whitespaceRemoved[0] === 'B') {
    // We are in years < 1000 B.C.
    result = parseBCYears(date);
  } else {
    // After year 0, we will either get it in ISO format or a whitespaced string format
    const yearIndex = whitespaceRemoved.indexOf('-');
    if (yearIndex >= 0) {
      result = parseJ2000Date(whitespaceRemoved, yearIndex);
    } else {
      result = parseLargeADYears(date);
    }
  }
  return !result.includes(zone) ? result.concat(zone) : result;
}

export function isDateValid(date: Date) {
  return !Number.isNaN(date.valueOf());
}
