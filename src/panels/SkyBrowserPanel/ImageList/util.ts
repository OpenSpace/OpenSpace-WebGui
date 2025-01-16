export const DistanceSortThreshold = 0.1;

export function distPow2(numberA: number, numberB: number) {
  return (numberA - numberB) * (numberA - numberB);
}

export function euclidianDistance(vec3a: number[], vec3b: number[]) {
  let sum = 0;
  for (let i = 0; i < 3; i++) {
    sum += distPow2(vec3a[i], vec3b[i]);
  }
  return Math.sqrt(sum);
}

export function isWithinFOV(coord: number, target: number, radius: number) {
  const lowerBoundary = target - radius;
  const higherBoundary = target + radius;
  // Test if lowerBoundary < coordinate < higherBoundary
  return lowerBoundary < coord && coord < higherBoundary;
}

export enum ViewingMode {
  allImages = 'All Images',
  skySurveys = 'Sky Surveys',
  nearestImages = 'Images Within View'
}
