import { useState } from 'react';
import { Flex, Group, NumberFormatter, Slider } from '@mantine/core';
import { scalePow } from 'd3';

import { NumericInput } from '@/components/Input/NumericInput';
import { PropertyLabel } from '@/components/Property/PropertyLabel';

interface Props {
  name: string;
  description: string;
  disabled: boolean;
  setPropertyValue: (newValue: number) => void;
  value: number;
  additionalData: {
    Exponent: number;
    MaximumValue: number;
    MinimumValue: number;
    SteppingValue: number;
  };
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

  // TODO: Figure out a nice way to handle this, i.e. update the current value when the
  // value property changes
  // useEffect(() => {
  //   setCurrentValue(value);
  // }, [value]);

  const min = additionalData.MinimumValue;
  const max = additionalData.MaximumValue;
  const step = additionalData.SteppingValue;
  const exponent = additionalData.Exponent;

  const scale = scalePow().exponent(exponent).domain([min, max]).range([min, max]);

  const getDecimalPlaces = (num: number) => {
    const match = ('' + num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
    if (!match) {
      return 0;
    }
    return Math.max(
      0,
      // Number of digits right of decimal point.
      (match[1] ? match[1].length : 0) -
        // Adjust for scientific notation.
        (match[2] ? +match[2] : 0)
    );
  };

  const decimalPlaces = getDecimalPlaces(step);

  function markLabel(value: number, largeValuePrecision?: number): JSX.Element | string {
    return value < 100000 && value > 0.0001 ? (
      <NumberFormatter value={value} decimalScale={decimalPlaces} />
    ) : (
      value.toPrecision(largeValuePrecision || 1)
    );
  }

  // TODO: Only create marks for valid steps and make it work nicely for integer steps
  const marksStep = (max - min) / 4;
  const marks = [
    { value: min, label: markLabel(min) },
    { value: min + 1 * marksStep },
    { value: min + 2 * marksStep, label: markLabel(min + 2 * marksStep) },
    { value: min + 3 * marksStep },
    { value: max, label: markLabel(max) }
  ];

  const scaledMarks = marks.map((mark) => ({
    value: scale.invert(mark.value),
    label: mark.label
  }));

  // Something, when no min/max is set, the marks for the slider cannot be nicely
  // compute it
  const hasNiceMinMax = isFinite(max - min);

  function onInput(newValue: number) {
    setCurrentValue(newValue);
    setPropertyValue(newValue);
  }

  return (
    <>
      <PropertyLabel label={name} tip={description} />
      <Group align={'bottom'}>
        {hasNiceMinMax && (
          <Slider
            flex={2}
            miw={100}
            label={(value) => (
              <NumberFormatter value={value} decimalScale={decimalPlaces} />
            )}
            disabled={disabled}
            value={currentValue}
            min={min}
            max={max}
            step={step}
            marks={scaledMarks}
            scale={(value) => scale(value)}
            onChange={onInput}
            opacity={disabled ? 0.5 : 1}
          />
        )}
        <Flex flex={1} miw={100}>
          <NumericInput
            defaultValue={currentValue}
            disabled={disabled}
            min={min}
            max={max}
            step={step}
            onEnter={onInput}
          />
        </Flex>
      </Group>
    </>
  );
}
