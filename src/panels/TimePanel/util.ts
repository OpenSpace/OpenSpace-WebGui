import { StepSizes, TimePart } from './types';

const Second = StepSizes[TimePart.Seconds];
const Minute = StepSizes[TimePart.Minutes];
const Hour = StepSizes[TimePart.Hours];
const Month = StepSizes[TimePart.Months];
const Day = StepSizes[TimePart.Days];
const Year = StepSizes[TimePart.Years];

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
  const dSeconds = Math.abs(deltaSeconds);

  // Define the units and their limits.
  // E.g. if the delta time is below 2 hours, we display it in minutes.
  // Or if the delta time is below 2 minutes, we display it in seconds.
  const units = [
    { limit: Minute * 2, unit: { label: 'second', factor: Second } },
    { limit: Hour * 2, unit: { label: 'minute', factor: Minute } },
    { limit: Day * 2, unit: { label: 'hour', factor: Hour } },
    { limit: Month * 2, unit: { label: 'day', factor: Day } },
    { limit: Year * 2, unit: { label: 'month', factor: Month } },
    { limit: Infinity, unit: { label: 'year', factor: Year } }
  ];

  const result = units.find(({ limit }) => dSeconds < limit);

  if (!result) {
    throw new Error('Invalid delta time');
  }

  const { unit } = result;

  // Convert the seconds to the new unit
  const dSecondsInUnit = dSeconds / unit.factor;

  // Pluralize label if the time in the new unit is greater than 1
  const label = dSecondsInUnit === 1 ? unit.label : `${unit.label}s`;
  return { increment: dSecondsInUnit, unit: label, isNegative };
}

/**
 * @param year Year to check the number of days (needed due to leap years)
 * @param month 0-indexed month
 * @returns The max days of the month for the specific year
 */
export function maxDaysInMonth(year: number, month: number): number {
  // Month in JavaScript is 0-indexed (January is 0, February is 1, etc),
  // but by using 0 as the day it will give us the last day of the prior
  // month. So passing in 1 as the month number will return the last day
  // of January, not February,
  // see: https://stackoverflow.com/questions/1184334/get-number-days-in-a-specified-month-using-javascript
  return new Date(year, month + 1, 0).getDate();
}
