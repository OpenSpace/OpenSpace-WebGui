import { useState } from 'react';
import { MdOutlineEdit } from 'react-icons/md';
import { ActionIcon, Grid, Slider } from '@mantine/core';
import { inRange } from 'lodash';

import { NumericInput } from '@/components/Input/NumericInput';

import { PropertyLabel } from '../PropertyLabel';

interface Props {
  name: string;
  description: string;
  disabled: boolean;
  setPropertyValue: (newValue: number) => void;
  value: number;
  additionalData: {
    Exponent: number; // TODO: handle the exponent
    MaximumValue: number;
    MinimumValue: number;
    SteppingValue: number;
  }
  // TODO: view options in metadata
}

export function NumericProperty({
  name,
  description,
  disabled,
  setPropertyValue,
  value,
  additionalData
}: Props) {
  const [currentValue, setCurrentValue] = useState<number>(value);

  const min = additionalData.MinimumValue;
  const max = additionalData.MaximumValue;
  const step = additionalData.SteppingValue;

  const marks = [
    { value: min, label: min },
    { value: (max - min) / 2, label: (max - min) / 2 },
    { value: max, label: max },
  ];

  // Always include zero if it exists in the range
  if (inRange(0, min, max)) {
    marks.push({ value: 0, label: 0 });
  }

  function onValueChange(newValue: number) {
    setCurrentValue(newValue);
    setPropertyValue(newValue);
  }

  if (disabled) {
    // TODO: this is better than slider for read-only values, but does not show the
    // min or maximum value...
    return (
      <NumericInput
        defaultValue={currentValue}
        disabled={disabled}
        label={<PropertyLabel label={name} tip={description} />}
      />
    )
  }

  return (
    <>
      <PropertyLabel label={name} tip={description} />
      <Grid>
        <Grid.Col span='auto'>
          <Slider
            disabled={disabled}
            value={currentValue}
            min={min}
            max={max}
            step={step}
            marks={marks}
            onChange={onValueChange}
          />
        </Grid.Col>
        <Grid.Col span='content'>
          {/* TODO: implement text editing */}
          <ActionIcon><MdOutlineEdit /></ActionIcon>
        </Grid.Col>
      </Grid>
      {/* Alternaitve - include  */}
      <PropertyLabel label={name} tip={description} />
      <Grid>
        <Grid.Col span='auto'>
          <Slider
            disabled={disabled}
            value={currentValue}
            min={min}
            max={max}
            step={step}
            marks={marks}
            onChange={onValueChange}
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <NumericInput
            // TODO: this does not update correctly when slider updates
            disabled={disabled}
            defaultValue={currentValue}
            min={min}
            max={max}
            step={step}
            onEnter={onValueChange}
          />
        </Grid.Col>
      </Grid >
    </>

  );
}
