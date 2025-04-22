import { Group, Stack, Text } from '@mantine/core';

import { DynamicGrid } from '@/components/DynamicGrid/DynamicGrid';
import { NumericInput } from '@/components/Input/NumericInput/NumericInput';
import { NumericSlider } from '@/components/Input/NumericInput/NumericSlider/NumericSlider';
import { AdditionalDataVectorMatrix } from '@/components/Property/types';
import { usePropListeningState } from '@/hooks/util';

interface Props {
  disabled: boolean;
  setPropertyValue: (value: number[]) => void;
  value: number[];
  additionalData: AdditionalDataVectorMatrix;
  isInt?: boolean;
  labels?: string[];
}

export function VectorDefaultView({
  disabled,
  setPropertyValue,
  value,
  additionalData,
  isInt = false,
  labels = ['x', 'y', 'z', 'w']
}: Props) {
  const { value: currentValue, setValue: setCurrentValue } =
    usePropListeningState<number[]>(value);

  const { MinimumValue: min, MaximumValue: max, SteppingValue: step } = additionalData;
  // @TODO (2025-03-03, emmbr) This should be handled a better way... This is a bit of a
  // hack and the max value is just arbitrarily chosen
  const maxAllowedExtentForSlider = 1e12;
  const shouldShowSlider = max.some((value, i) => {
    // When no min/max is set, the marks for the slider cannot be nicely computed
    const extent = value - min[i];
    return isFinite(value - min[i]) && extent < maxAllowedExtentForSlider;
  });

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
        <Group wrap={"nowrap"} align={"start"} gap={'xs'} grow preventGrowOverflow={false}>
          <Text c={'dimmed'} mt={5} flex={0} size={"sm"}>
            {labels[i]}
          </Text>
          <Stack key={i} gap={'xs'}>
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
              />
            )}
          </Stack>
        </Group>
      ))}
    </DynamicGrid>
  );
}
