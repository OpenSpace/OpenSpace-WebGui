import { Flex } from '@mantine/core';

import { NumericInput } from '@/components/Input/NumericInput/NumericInput';
import { PropertyLabel } from '@/components/Property/PropertyLabel';
import { VectorPropertyProps } from '@/components/Property/Types/VectorProperty/VectorProperty';

export function ValueList({
  name,
  description,
  disabled,
  setPropertyValue,
  value,
  additionalData
}: VectorPropertyProps) {
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
        {value.map((v, i) => (
          <NumericInput
            key={i}
            value={v}
            disabled={disabled}
            min={min[i]}
            max={max[i]}
            step={step[i]}
            onEnter={(newValue) => setValue(i, newValue)}
          />
        ))}
      </Flex>
    </>
  );
}
