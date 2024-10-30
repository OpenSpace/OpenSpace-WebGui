import { useState } from 'react';
import { MdOutlineEdit } from 'react-icons/md';
import { ActionIcon, Grid, NumberInput, Slider } from '@mantine/core';
import { inRange } from 'lodash';

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
  const [currentEditValue, setEditValue] = useState<number>(value);

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

  function onKeyUp(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      setPropertyValue(currentEditValue);
      event.currentTarget.blur();
    } else if (event.key === 'Escape') {
      setEditValue(value);
      event.currentTarget.blur();
    }
  }

  if (disabled) {
    // TODO: this is better, but does not show the maximum value...
    return (
      <NumberInput
        value={value}
        disabled={disabled}
        label={<PropertyLabel label={name} tip={description} />}
      />
    )
  }

  return (
    <>
      {/* Alternative 1, just a number input */}
      {/* <NumberInput
        value={currentEditValue}
        min={min}
        max={max}
        step={step}
        onValueChange={(v) => {
          if (v.floatValue !== undefined) {
            setEditValue(v.floatValue)
          }
          else {
            // ?
          }
        }}
        disabled={disabled}
        label={<PropertyLabel label={name} tip={description} />}
      /> */}
      {/* Alternaitve 2, just a slider */}
      <PropertyLabel label={name} tip={description} />
      <Grid>
        <Grid.Col span='auto'>
          <Slider
            disabled={disabled}
            value={value}
            min={min}
            max={max}
            step={step}
            marks={marks}
            onChange={(v) => setPropertyValue(v)}
          />
        </Grid.Col>
        <Grid.Col span='content'>
          {/* TODO: implement text editing */}
          <ActionIcon><MdOutlineEdit /></ActionIcon>
        </Grid.Col>
      </Grid>
      {/* Alternaitve 3, just a slider */}
      {/* <PropertyLabel label={name} tip={description} />
      <Grid>
        <Grid.Col span='auto'>
          <Slider
            disabled={disabled}
            value={value}
            min={min}
            max={max}
            step={step}
            marks={marks}
            onChange={(v) => setPropertyValue(v)}
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <NumberInput
            disabled={disabled}
            value={value}
            min={min}
            max={max}
            step={step}
            stepHoldDelay={500}
            onValueChange={(v) => {
              if (v.floatValue !== undefined) {
                setPropertyValue(v.floatValue)
              }
              else {
                // ?
              }
            }}
            onKeyUp={onKeyUp}
            error={undefined} // TODO: use to show error messages
          />
        </Grid.Col>
    </Grid >*/}
    </>

  );
}
