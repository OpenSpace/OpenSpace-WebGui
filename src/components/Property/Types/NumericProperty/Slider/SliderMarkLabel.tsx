import { NumberFormatter } from '@mantine/core';

interface Props {
  value: number;
  decimalPlaces?: number;
}

export function SliderMarkLabel({ value, decimalPlaces }: Props) {
  return value < 100000 && value > 0.0001 ? (
    <NumberFormatter value={value} decimalScale={decimalPlaces} />
  ) : (
    // For very large or very small values, we use scientific notation
    value.toPrecision(1)
  );
}
