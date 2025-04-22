import { Group, NumberFormatter, RangeSlider, Stack } from '@mantine/core';

import { NumericInput } from '@/components/Input/NumericInput/NumericInput';
import { useSliderScale } from '@/components/Input/NumericInput/NumericSlider/hooks';
import { SliderMinMaxLabels } from '@/components/Input/NumericInput/NumericSlider/MinMaxLabels';
import { AdditionalDataVectorMatrix } from '@/components/Property/types';
import { usePropListeningState } from '@/hooks/util';

interface Props {
  disabled: boolean;
  setPropertyValue: (value: number[]) => void;
  value: number[];
  additionalData: AdditionalDataVectorMatrix;
}

export function MinMaxRangeView({
  disabled,
  setPropertyValue,
  value,
  additionalData
}: Props) {
  if (value.length !== 2) {
    throw Error('Invalid use of MinMaxRange view option!');
  }
  const {
    value: currentValue,
    setValue: setCurrentValue,
    setIsEditing: setIsEditingSlider
  } = usePropListeningState<number[]>(value);

  const exponent = additionalData.Exponent;
  const [min] = additionalData.MinimumValue;
  const [max] = additionalData.MaximumValue;
  const [step] = additionalData.SteppingValue;

  const { scale, scaledMarks, valueToSliderValue, sliderValueToValue } = useSliderScale(
    exponent,
    min,
    max
  );

  function onValueChange(newValue: [number, number]) {
    setCurrentValue(newValue);
    setPropertyValue(newValue);
  }

  function onSliderInput(newValue: [number, number]) {
    setIsEditingSlider(true);
    const newCombinedValue: [number, number] = [
      sliderValueToValue(newValue[0]),
      sliderValueToValue(newValue[1])
    ];
    setCurrentValue(newCombinedValue);
    onValueChange(newCombinedValue);
  }

  const commonProps = { disabled, min, max, step };

  // @TODO (2025-03-14, emmbr): Prevent entering numeric values where e.g. max < min?
  // Or at least provide a warning?
  return (
    <Stack gap={'xs'} mb={'xs'}>
      <Group grow>
        <NumericInput
          value={currentValue[0]}
          onEnter={(newFirst) => onValueChange([newFirst, currentValue[1]])}
          {...commonProps}
        />
        <NumericInput
          value={currentValue[1]}
          onEnter={(newSecond) => onValueChange([currentValue[0], newSecond])}
          {...commonProps}
        />
      </Group>
      <Stack gap={0}>
        <RangeSlider
          label={(number) => <NumberFormatter value={number} />}
          value={[
            valueToSliderValue(currentValue[0]),
            valueToSliderValue(currentValue[1])
          ]}
          marks={scaledMarks}
          scale={scale}
          onChange={onSliderInput}
          onChangeEnd={() => setIsEditingSlider(false)}
          opacity={disabled ? 0.5 : 1}
          {...commonProps}
        />
        <SliderMinMaxLabels min={min} max={max} />
      </Stack>
    </Stack>
  );
}
