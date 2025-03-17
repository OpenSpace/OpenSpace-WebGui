import { Flex } from '@mantine/core';

import { NumericInput } from '@/components/Input/NumericInput/NumericInput';
import { usePropListeningState } from '@/api/hooks';
import { AdditionalDataVectorMatrix } from '@/components/Property/types';

interface Props {
  disabled: boolean;
  setPropertyValue: (value: number[]) => void;
  value: number[];
  additionalData: AdditionalDataVectorMatrix;
  isInt?: boolean;
}

export function DefaultVectorProperty({
  disabled,
  setPropertyValue,
  value,
  additionalData,
  isInt
}: Props) {
  const { value: shownValue } = usePropListeningState<number[]>(value);

  const { MinimumValue: min, MaximumValue: max, SteppingValue: step } = additionalData;

  function setValue(index: number, newValue: number) {
    const v = [...value];
    v[index] = newValue;
    setPropertyValue(v);
  }

  return (
    <Flex gap={'xs'}>
      {shownValue.map((item, i) => (
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
