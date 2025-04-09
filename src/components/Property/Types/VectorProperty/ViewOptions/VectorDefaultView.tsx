import { Flex } from '@mantine/core';

import { NumericInput } from '@/components/Input/NumericInput/NumericInput';
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

  function setValue(index: number, newValue: number) {
    const v = [...value];
    v[index] = newValue;
    setPropertyValue(v);
    setCurrentValue(v);
  }

  return (
    <Flex gap={'xs'}>
      {currentValue.map((item, i) => (
        <NumericInput
          miw={40}
          key={i}
          value={item}
          disabled={disabled}
          min={min[i]}
          max={max[i]}
          step={step[i]}
          allowDecimal={!isInt}
          onEnter={(newValue) => setValue(i, newValue)}
        />
      ))}
    </Flex>
  );
}
