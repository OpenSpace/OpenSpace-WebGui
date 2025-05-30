import { MantineStyleProps, NumberFormatter, Slider, Stack } from '@mantine/core';

import { usePropListeningState } from '@/hooks/util';
import { stepToDecimalPlaces } from '@/util/numeric';

import { useSliderScale } from './hooks';
import { MinMaxLabels } from './MinMaxLabels';

interface Props extends MantineStyleProps {
  disabled: boolean;
  value: number;
  min: number;
  max: number;
  step: number;
  onInput: (newValue: number) => void;
  exponent?: number;
  showMarks?: boolean;
}

export function NumericSlider({
  disabled,
  value,
  min,
  max,
  step,
  onInput,
  exponent = 1,
  showMarks = true,
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
        label={(number) => (
          <NumberFormatter value={number} decimalScale={decimalPlaces} />
        )}
        disabled={disabled}
        value={valueToSliderValue(currentValue)}
        min={min}
        max={max}
        step={step}
        marks={showMarks ? scaledMarks : undefined}
        scale={scale}
        onChange={onSliderInput}
        onChangeEnd={() => setIsEditingSlider(false)}
        opacity={disabled ? 0.5 : 1}
      />
      <MinMaxLabels min={min} max={max} decimalPlaces={decimalPlaces} />
    </Stack>
  );
}
