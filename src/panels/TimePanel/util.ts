/**
 * Converts delta time (in seconds) into a unit friendly format (seconds, min, hours, etc)
 * @param deltaSeconds The delta in seconds, can be positive or negative
 * @returns An object containing:
 * - `increment`: The numerical value in the chosen unit.
 * - `unit`: The corresponding time unit e.g., "minute", "hour", "day".
 * - `isNegative`: Wheter the original delta was negative.
 */
export function formatDeltaTime(deltaSeconds: number): {
  increment: number;
  unit: string;
  isNegative: boolean;
} {
  const isNegative = deltaSeconds < 0;
  let unit = 'second';
  let increment = Math.abs(deltaSeconds);

  // Limit: the threshold to check if we should switch to the next unit
  // Factor: value to divide when moving to the new unit
  const timeUnits = [
    { limit: 60 * 2, factor: 60, unit: 'minute' },
    { limit: 60 * 2, factor: 60, unit: 'hour' },
    { limit: 24 * 2, factor: 24, unit: 'day' },
    { limit: (365 / 12) * 2, factor: 365 / 12, unit: 'month' },
    { limit: 12, factor: 12, unit: 'year' } //
  ];

  // Find the most appropriate unit
  for (const { limit, factor, unit: nextUnit } of timeUnits) {
    if (increment < limit) {
      break;
    }
    increment /= factor;
    unit = nextUnit;
  }

  return { increment, unit, isNegative };
}

/**
 * @param year Year
 * @param month 0-indexed month
 * @returns The max days of the month given a specific date
 */
export function maxDaysInMonth(year: number, month: number): number {
  // Month in JavaScript is 0-indexed (January is 0, February is 1, etc),
  // but by using 0 as the day it will give us the last day of the prior
  // month. So passing in 1 as the month number will return the last day
  // of January, not February,
  // see: https://stackoverflow.com/questions/1184334/get-number-days-in-a-specified-month-using-javascript
  return new Date(year, month + 1, 0).getDate();
}
