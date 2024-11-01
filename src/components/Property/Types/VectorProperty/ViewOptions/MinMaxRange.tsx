import { useState } from 'react';
import { RangeSlider } from '@mantine/core';

import { PropertyLabel } from '../../../PropertyLabel';
import { VectorPropertyProps } from '../VectorProperty';

export function MinMaxRange({
  name,
  description,
  disabled,
  setPropertyValue,
  value,
  additionalData
}: VectorPropertyProps) {
  const [currentValue, setCurrentValue] = useState<[number, number]>(
    [value[0], value[1]]
  );

  if (value.length !== 2) {
    console.error("Invalid use of MinMaxRange view option!");
    return;
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
    <>
      <PropertyLabel label={name} tip={description} />
      <RangeSlider
        disabled={disabled}
        value={currentValue}
        min={min}
        max={max}
        step={step}
        // marks={marks} // TODO: Something clever
        onChange={onValueChange}
      />
    </>
  );
}
