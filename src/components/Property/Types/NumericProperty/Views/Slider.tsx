import { Slider } from '@mantine/core';
import { scalePow } from 'd3';
import { inRange } from 'lodash';

interface Props {
  disabled: boolean;
  exponent: number;
  min: number;
  max: number;
  step: number;
}

export function NumericPropertySlider({ disabled, exponent, min, max, step }: Props) {
  const marksStep = (max - min) / 4;
  const marks = [
    { value: min, label: min },
    { value: min + marksStep, label: min + marksStep },
    { value: min + 2 * marksStep, label: min + 2 * marksStep },
    { value: min + 3 * marksStep, label: min + 3 * marksStep },
    { value: max, label: max }
  ];

  // ALways add 0 if it in the range
  if (inRange(0, min, max)) {
    marks.push({ value: 0, label: 0 });
  }

  const scale = scalePow().exponent(exponent).domain([min, max]).range([min, max]);

  const scaledMarks = marks.map((mark) => ({
    label: mark.value,
    value: scale.invert(mark.value)
  }));

  return (
    <Slider
      disabled={disabled}
      thumbSize={14}
      label={(value) => value.toFixed(2)}
      // value={currentValue}
      min={min}
      max={max}
      step={step}
      marks={scaledMarks}
      scale={(value) => scale(value)}
      //   onChange={onValueChange}
    />
  );
}
