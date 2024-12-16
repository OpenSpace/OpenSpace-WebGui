import { useState } from 'react';
import { RangeSlider } from '@mantine/core';

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

  function onValueChange(newValue: [number, number]) {
    setCurrentValue(newValue);
    setPropertyValue(newValue);
  }

  // TODO: Add a way to edit the values using NumericInputs
  return (
    <RangeSlider
      disabled={disabled}
      value={currentValue}
      min={min}
      max={max}
      step={step}
      // marks={marks} // TODO: Something clever
      onChange={onValueChange}
    />
  );
}
