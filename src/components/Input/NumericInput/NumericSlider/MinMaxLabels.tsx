import { Group, NumberFormatter, Text } from '@mantine/core';

interface Props {
  min: number;
  max: number;
  decimalPlaces?: number;
}

function SliderMarkLabel({
  value,
  decimalPlaces
}: {
  value: number;
  decimalPlaces?: number;
}) {
  return value < 100000 && value > 0.0001 ? (
    <NumberFormatter value={value} decimalScale={decimalPlaces} />
  ) : (
    // For very large or very small values, we use scientific notation
    value.toPrecision(1)
  );
}

export function MinMaxLabels({ min, max, decimalPlaces }: Props) {
  return (
    <Group justify={'space-between'} px={2}>
      <Text size={'xs'} c={'dimmed'}>
        <SliderMarkLabel value={min} decimalPlaces={decimalPlaces} />
      </Text>
      <Text size={'xs'} c={'dimmed'}>
        <SliderMarkLabel value={max} decimalPlaces={decimalPlaces} />
      </Text>
    </Group>
  );
}
