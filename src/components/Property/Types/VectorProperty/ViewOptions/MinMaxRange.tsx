import { useState } from 'react';
import { Group, RangeSlider, Stack } from '@mantine/core';

import { NumericInput } from '@/components/Input/NumericInput';
import { VectorPropertyProps } from '@/components/Property/Types/VectorProperty/VectorProperty';

export function MinMaxRange({
  disabled,
  setPropertyValue,
  value,
  additionalData
}: VectorPropertyProps) {
  const [currentValue, setCurrentValue] = useState<[number, number]>([
    value[0],
    value[1]
  ]);

  if (value.length !== 2) {
    throw Error('Invalid use of MinMaxRange view option!');
  }

  const [min] = additionalData.MinimumValue;
  const [max] = additionalData.MaximumValue;
  const [step] = additionalData.SteppingValue;

  const marks = [
    { value: min, label: min },
    { value: max, label: max }
  ];

  function onValueChange(newValue: [number, number]) {
    setCurrentValue(newValue);
    setPropertyValue(newValue);
  }

  // TODO: Add a way to edit the values using NumericInputs
  return (
    <Stack>
      <RangeSlider
        disabled={disabled}
        value={currentValue}
        min={min}
        max={max}
        step={step}
        marks={marks}
        onChange={onValueChange}
      />
      <Group grow>
        <NumericInput defaultValue={currentValue[0]} />
        <NumericInput defaultValue={currentValue[1]} />
      </Group>
    </Stack>
  );
}
