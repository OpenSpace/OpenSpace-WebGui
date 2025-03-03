import { MantineStyleProps, NumberFormatter, Slider } from '@mantine/core';
import { scalePow } from 'd3';

import { usePropListeningState } from '@/api/hooks';

import { SliderMarkLabel } from './SliderMarkLabel';

interface Props extends MantineStyleProps {
  disabled: boolean;
  value: number;
  min: number;
  max: number;
  step: number;
  onInput: (newValue: number) => void;
  exponent?: number;
  isInt?: boolean;
}

export function NumericPropertySlider({
  disabled,
  value,
  min,
  max,
  step,
  onInput,
  exponent = 1,
  isInt,
  ...props
}: Props) {
  // Note that this value does not take the slider scale into account
  const {
    value: currentValue,
    setValue: setCurrentValue,
    setIsEditing: setIsEditingSlider
  } = usePropListeningState<number>(value);

  const scale = scalePow().exponent(exponent).domain([min, max]).range([min, max]);
  const decimalPlaces = Math.max(0, -Math.floor(Math.log10(step)));

  function computeMarks() {
    const extent = max - min;

    // When no min/max is set, the marks for the slider cannot be nicely computed
    if (!isFinite(extent)) {
      return [];
    }

    // The step for the marks is about a quarter of the full extent
    let marksStep = extent / 4;
    if (isInt) {
      marksStep = Math.round(marksStep);
    }

    // The halfway step should be a relatively nice value, so we handle it differently
    // depending on the extent of the range
    const halfWay = extent > 2 ? Math.round(extent / 2) : extent / 2;

    return [
      {
        value: min,
        label: <SliderMarkLabel value={min} decimalPlaces={decimalPlaces} />
      },
      { value: min + 1 * marksStep },
      {
        value: halfWay,
        label: <SliderMarkLabel value={halfWay} decimalPlaces={decimalPlaces} />
      },
      { value: min + 3 * marksStep },
      { value: max, label: <SliderMarkLabel value={max} decimalPlaces={decimalPlaces} /> }
    ];
  }

  const marks = computeMarks();
  const scaledMarks = marks.map((mark) => ({
    value: scale.invert(mark.value),
    label: mark.label
  }));

  function onSliderInput(newValue: number) {
    setIsEditingSlider(true);
    setCurrentValue(sliderValueToValue(newValue));
    onInput(sliderValueToValue(newValue));
  }

  function valueToSliderValue(value: number) {
    return scale.invert(value);
  }

  function sliderValueToValue(sliderValue: number) {
    return scale(sliderValue);
  }

  // @TODO (2025-02-05, emmbr): The slider value and resulting property value are not in
  // sync, and this is something that the accessibility consultant commented on. We should
  // make sure that the set value (i.e. including the scale) is property communicated to
  // screen readers
  return (
    <Slider
      label={(v) => <NumberFormatter value={v} decimalScale={decimalPlaces} />}
      disabled={disabled}
      value={valueToSliderValue(currentValue)}
      min={min}
      max={max}
      step={step}
      marks={scaledMarks}
      scale={(v) => scale(v)}
      onChange={onSliderInput}
      onChangeEnd={() => setIsEditingSlider(false)}
      opacity={disabled ? 0.5 : 1}
      {...props}
    />
  );
}
