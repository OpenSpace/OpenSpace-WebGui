import { Group, RangeSlider, Stack } from '@mantine/core';

import { usePropListeningState } from '@/api/hooks';
import { NumericInput } from '@/components/Input/NumericInput/NumericInput';
import { VectorPropertyProps } from '@/components/Property/Types/VectorProperty/VectorProperty';

export function MinMaxRange({
  disabled,
  setPropertyValue,
  value,
  additionalData
}: VectorPropertyProps) {
  const {
    value: currentValue,
    setValue: setCurrentValue,
    setIsEditing: setIsEditingSlider
  } = usePropListeningState<[number, number]>([value[0], value[1]]);

  if (value.length !== 2) {
    throw Error('Invalid use of MinMaxRange view option!');
  }

  const [min] = additionalData.MinimumValue;
  const [max] = additionalData.MaximumValue;
  const [step] = additionalData.SteppingValue;

  const marks = [
    { value: min, label: min },
    { value: max, label: max }
  ];

  function onValueChange(newValue: [number, number]) {
    setCurrentValue(newValue);
    setPropertyValue(newValue);
  }

  const commonProps = { disabled, min, max, step };

  // @TODO: Prevent entering numeric values where e.g. max < min? Or at least provide a
  // warning?
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
      <RangeSlider
        value={currentValue}
        marks={marks}
        onChange={(newValue) => {
          onValueChange(newValue);
          setIsEditingSlider(true);
        }}
        onChangeEnd={() => setIsEditingSlider(false)}
        {...commonProps}
      />
    </Stack>
  );
}
