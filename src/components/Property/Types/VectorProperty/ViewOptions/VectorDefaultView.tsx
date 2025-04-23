import { Group, Stack, Text } from '@mantine/core';

import { DynamicGrid } from '@/components/DynamicGrid/DynamicGrid';
import { NumericInput } from '@/components/Input/NumericInput/NumericInput';
import { NumericSlider } from '@/components/Input/NumericInput/NumericSlider/NumericSlider';
import { validSliderExtent } from '@/components/Input/NumericInput/NumericSlider/util';
import { AdditionalDataVectorMatrix } from '@/components/Property/types';
import { usePropListeningState } from '@/hooks/util';

interface Props {
  disabled: boolean;
  setPropertyValue: (value: number[]) => void;
  value: number[];
  additionalData: AdditionalDataVectorMatrix;
  isInt?: boolean;
}

export function VectorDefaultView({
  disabled,
  setPropertyValue,
  value,
  additionalData,
  isInt = false
}: Props) {
  const { value: currentValue, setValue: setCurrentValue } =
    usePropListeningState<number[]>(value);

  const { MinimumValue: min, MaximumValue: max, SteppingValue: step } = additionalData;
  const shouldShowSlider = max.every((max, i) => validSliderExtent(min[i], max));
  const labels = ['x', 'y', 'z', 'w'];

  function setValue(index: number, newValue: number) {
    const v = [...value];
    v[index] = newValue;
    setPropertyValue(v);
    setCurrentValue(v);
  }

  return (
    <DynamicGrid
      minChildSize={120}
      maxCols={currentValue.length}
      spacing={'xs'}
      verticalSpacing={'xs'}
    >
      {currentValue.map((item, i) => (
        <Group
          wrap={'nowrap'}
          align={'start'}
          gap={'xs'}
          grow
          preventGrowOverflow={false}
          key={i}
        >
          <Text c={'dimmed'} mt={5} flex={0} size={'sm'}>
            {labels[i]}
          </Text>
          <Stack gap={'xs'}>
            <NumericInput
              value={item}
              disabled={disabled}
              min={min[i]}
              max={max[i]}
              step={step[i]}
              allowDecimal={!isInt}
              onEnter={(newValue) => setValue(i, newValue)}
            />
            {shouldShowSlider && (
              <NumericSlider
                value={item}
                disabled={disabled}
                min={min[i]}
                max={max[i]}
                step={step[i]}
                onInput={(newValue) => setValue(i, newValue)}
                showMarks={false}
              />
            )}
          </Stack>
        </Group>
      ))}
    </DynamicGrid>
  );
}
