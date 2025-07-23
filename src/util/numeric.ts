export function stepToDecimalPlaces(step: number): number {
  const stepStr = step.toString();
  if (!stepStr.includes('.')) {
    return 0;
  }
  return stepStr.split('.').pop()?.length ?? 0;
}

// Round to # decimal places
export function roundTo(num: number, decimalPlaces: number): number {
  return parseFloat(num.toFixed(decimalPlaces));
}
