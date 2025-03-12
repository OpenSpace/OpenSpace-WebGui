export function stepToDecimalPlaces(step: number): number {
  const stepStr = step.toString();
  const decimalPlaces = stepStr.includes('.') ? stepStr.split('.')[1].length : 0;
  return decimalPlaces;
}

export function roundNumberToDecimalPlaces(num: number, decimalPlaces: number): number {
  return parseFloat(num.toFixed(decimalPlaces));
}
