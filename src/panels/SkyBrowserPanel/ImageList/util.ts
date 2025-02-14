export enum ViewingMode {
  allImages = 'All Images',
  skySurveys = 'Sky Surveys',
  nearestImages = 'Images Within View'
}

export const DistanceSortThreshold = 0.1;

export function distPow2(numberA: number, numberB: number) {
  return (numberA - numberB) * (numberA - numberB);
}

export function euclidianDistance(vec3a: number[], vec3b: number[]) {
  const sum = vec3a.reduce((acc, value, i) => acc + distPow2(value, vec3b[i]), 0);
  return Math.sqrt(sum);
}

export function isWithinFOV(coord: number, target: number, radius: number) {
  const lowerBoundary = target - radius;
  const higherBoundary = target + radius;
  // Test if lowerBoundary < coordinate < higherBoundary
  return lowerBoundary < coord && coord < higherBoundary;
}
