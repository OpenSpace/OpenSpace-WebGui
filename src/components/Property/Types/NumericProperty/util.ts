export function stepToDecimalPlaces(step: number): number {
  const stepStr = step.toString();
  if (!stepStr.includes('.')) {
    return 0;
  }
  return stepStr.split('.').pop()?.length ?? 0;
}

export function roundNumberToDecimalPlaces(num: number, decimalPlaces: number): string {
  return parseFloat(num.toFixed(decimalPlaces)).toString();
}
