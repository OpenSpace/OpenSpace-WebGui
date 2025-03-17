import { Flex } from '@mantine/core';

import { NumericInput } from '@/components/Input/NumericInput/NumericInput';
import { AdditionalData } from '@/components/Property/Types/VectorProperty/VectorProperty';

interface Props {
  disabled: boolean;
  setPropertyValue: (value: number[]) => void;
  value: number[];
  additionalData: AdditionalData;
  isInt?: boolean;
}

export function ValueList({
  disabled,
  setPropertyValue,
  value,
  additionalData,
  isInt
}: Props) {
  const { MinimumValue: min, MaximumValue: max, SteppingValue: step } = additionalData;

  function setValue(index: number, newValue: number) {
    const v = [...value];
    v[index] = newValue;
    setPropertyValue(v);
  }

  return (
    <Flex gap={'xs'}>
      {value.map((item, i) => (
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
