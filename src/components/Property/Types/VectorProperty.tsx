import { Flex } from '@mantine/core';

import { NumericInput } from '@/components/Input/NumericInput';

import { PropertyLabel } from '../PropertyLabel';

interface Props {
  name: string;
  description: string;
  disabled: boolean;
  setPropertyValue: (newValue: number[]) => void;
  value: number[];
  additionalData: {
    Exponent: number; // TODO: handle the exponent
    MaximumValue: number[];
    MinimumValue: number[];
    SteppingValue: number[];
  }
  // TODO: view options in metadata (Color, MinMaxRange)
}

export function VectorProperty({
  name,
  description,
  disabled,
  setPropertyValue,
  value,
  additionalData
}: Props) {
  const min = additionalData.MinimumValue;
  const max = additionalData.MaximumValue;
  const step = additionalData.SteppingValue;

  function setValue(index: number, newValue: number) {
    const v = [...value];
    v[index] = newValue;
    setPropertyValue(v);
  }

  return (
    <>
      <PropertyLabel label={name} tip={description} />
      <Flex>
        {value.map((v, i) =>
          <NumericInput
            key={i}
            defaultValue={v}
            min={min[i]}
            max={max[i]}
            step={step[i]}
            onEnter={(newValue) => setValue(i, newValue)}
            disabled={disabled}
          />
        )}
      </Flex>
    </>
  );
}
