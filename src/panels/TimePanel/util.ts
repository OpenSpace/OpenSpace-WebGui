export function formatDeltaTime(deltaSeconds: number): {
  increment: number;
  unit: string;
  sign: string;
} {
  const isNegative = Math.sign(deltaSeconds) === -1;
  const sign = isNegative ? '-' : '';
  let unit = 'second';
  let increment = Math.abs(deltaSeconds);

  // Limit: the threshold to check if we should switch to the next unit
  // Factor: value to divide when moving to the new unit
  const timeUnits = [
    { limit: 60 * 2, factor: 60, unit: 'minute' },
    { limit: 60 * 2, factor: 60, unit: 'hour' },
    { limit: 24 * 2, factor: 24, unit: 'day' },
    { limit: (365 / 12) * 2, factor: 365 / 12, unit: 'month' },
    { limit: 12, factor: 12, unit: 'year' }
  ];

  for (const { limit, factor, unit: nextUnit } of timeUnits) {
    if (increment < limit) {
      break;
    }
    increment /= factor;
    unit = nextUnit;
  }

  return { increment, unit, sign };
}
