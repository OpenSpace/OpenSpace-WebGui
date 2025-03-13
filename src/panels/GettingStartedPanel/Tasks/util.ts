export function compareAltitude(
  currentAltitude: number | undefined,
  altitude: number,
  compare: 'lower' | 'higher'
) {
  if (currentAltitude === undefined) {
    return false;
  }
  return compare === 'lower' ? currentAltitude <= altitude : currentAltitude >= altitude;
}
