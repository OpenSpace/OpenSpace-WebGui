import { MantineStyleProps, Slider, Stack } from '@mantine/core';

import { usePropListeningState } from '@/api/hooks';
import { useSliderScale } from '@/components/Property/SliderUtil/hook';
import { SliderMinMaxLabels } from '@/components/Property/SliderUtil/SliderMinMaxLabels';

import { roundNumberToDecimalPlaces, stepToDecimalPlaces } from '../util';

interface Props extends MantineStyleProps {
  disabled: boolean;
  value: number;
  min: number;
  max: number;
  step: number;
  onInput: (newValue: number) => void;
  exponent?: number;
}

export function NumericPropertySlider({
  disabled,
  value,
  min,
  max,
  step,
  onInput,
  exponent = 1,
  ...styleProps
}: Props) {
  // Note that this value does not take the slider scale into account
  const {
    value: currentValue,
    setValue: setCurrentValue,
    setIsEditing: setIsEditingSlider
  } = usePropListeningState<number>(value);

  const { scale, scaledMarks, valueToSliderValue, sliderValueToValue } = useSliderScale(
    exponent,
    min,
    max
  );

  const decimalPlaces = stepToDecimalPlaces(step);

  function onSliderInput(newValue: number) {
    setIsEditingSlider(true);
    setCurrentValue(sliderValueToValue(newValue));
    onInput(sliderValueToValue(newValue));
  }

  // @TODO (2025-02-05, emmbr): The slider value and resulting property value are not in
  // sync, and this is something that the accessibility consultant commented on. We should
  // make sure that the set value (i.e. including the scale) is property communicated to
  // screen readers
  return (
    <Stack gap={0} {...styleProps}>
      <Slider
        label={(scaledValue) => roundNumberToDecimalPlaces(scaledValue, decimalPlaces)}
        disabled={disabled}
        value={valueToSliderValue(currentValue)}
        min={min}
        max={max}
        step={step}
        marks={scaledMarks}
        scale={scale}
        onChange={onSliderInput}
        onChangeEnd={() => setIsEditingSlider(false)}
        opacity={disabled ? 0.5 : 1}
      />
      <SliderMinMaxLabels min={min} max={max} decimalPlaces={decimalPlaces} />
    </Stack>
  );
}
