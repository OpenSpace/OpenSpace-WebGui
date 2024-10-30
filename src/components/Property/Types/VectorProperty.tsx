import { Flex, NumberInput } from '@mantine/core';

import { PropertyLabel } from '../PropertyLabel';

interface Props {
  name: string;
  description: string;
  disabled: boolean;
  setPropertyValue: (newValue: number[]) => void;
  value: number[];
  additionalData: {
    Exponent: number; // TODO: handle the exponent
    MaximumValue: number[];
    MinimumValue: number[];
    SteppingValue: number[];
  }
  // TODO: view options in metadata (Color, MinMaxRange)
}

export function VectorProperty({
  name,
  description,
  disabled,
  setPropertyValue,
  value,
  additionalData
}: Props) {

  const min = additionalData.MinimumValue;
  const max = additionalData.MaximumValue;
  const step = additionalData.SteppingValue;

  function onValueChange(index: number, newValue: number | undefined) {
    if (newValue !== undefined) {
      const v = [...value];
      v[index] = newValue;
      setPropertyValue(v);
    }
  }

  // TODO: Only change value on enter when editing using text

  return (
    <>
      <PropertyLabel label={name} tip={description} />
      <Flex>
        {value.map((v, i) =>
          <NumberInput
            key={i}
            value={v}
            min={min[i]}
            max={max[i]}
            step={step[i]}
            stepHoldDelay={500}
            stepHoldInterval={100}
            onValueChange={(newV) => onValueChange(i, newV.floatValue)}
            disabled={disabled}
            error={(v < min[i] || v > max[i]) && "Invalid"} // TODO: Better error handling
          />
        )}
      </Flex>
    </>
  );
}
