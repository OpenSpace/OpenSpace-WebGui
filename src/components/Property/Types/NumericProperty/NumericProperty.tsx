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
  // Note that this value does not take the slider scale into account
  const [currentSliderValue, setCurrentSliderValue] = useState<number>(value);

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

  const decimalPlaces = Math.max(0, -Math.floor(Math.log10(step)));

  function markLabel(value: number, largeValuePrecision?: number): JSX.Element | string {
    return value < 100000 && value > 0.0001 ? (
      <NumberFormatter value={value} decimalScale={decimalPlaces} />
    ) : (
      value.toPrecision(largeValuePrecision || 1)
    );
  }

  // When no min/max is set, the marks for the slider cannot be nicely computed
  const hasNiceMinMax = isFinite(max - min);

  // @TODO: Only create marks for valid steps and make it work nicely for integer steps
  const marksStep = (max - min) / 4;
  const marks = hasNiceMinMax
    ? [
        { value: min, label: markLabel(min) },
        { value: min + 1 * marksStep },
        { value: min + 2 * marksStep, label: markLabel(min + 2 * marksStep) },
        { value: min + 3 * marksStep },
        { value: max, label: markLabel(max) }
      ]
    : [];

  const scaledMarks = marks.map((mark) => ({
    value: scale.invert(mark.value),
    label: mark.label
  }));

  function onSliderInput(newValue: number) {
    setCurrentSliderValue(newValue);
    setPropertyValue(scale(newValue));
  }

  function onNumberInput(newValue: number) {
    setCurrentSliderValue(scale.invert(newValue));
    setPropertyValue(newValue);
  }

  // @TODO (2025-02-05, emmbr): The slider value and resulting property value are not in
  // sync, and this is something that the accessibility consultant commented on. We should
  // make sure that the set value (i.e. including the scale) is property communicated to
  // screen readers
  return (
    <>
      <PropertyLabel label={name} tip={description} />
      <Group align={'bottom'}>
        {hasNiceMinMax && ( //
          <Slider
            flex={2}
            miw={100}
            label={(v) => <NumberFormatter value={v} decimalScale={decimalPlaces} />}
            disabled={disabled}
            value={currentSliderValue}
            min={min}
            max={max}
            step={step}
            marks={scaledMarks}
            scale={(v) => scale(v)}
            onChange={onSliderInput}
            opacity={disabled ? 0.5 : 1}
          />
        )}
        <Flex flex={1} miw={100}>
          <NumericInput
            defaultValue={scale(currentSliderValue)}
            disabled={disabled}
            min={min}
            max={max}
            step={step}
            onEnter={onNumberInput}
          />
        </Flex>
      </Group>
    </>
  );
}
