import { Box, Flex } from '@mantine/core';

import { NumericInput } from '@/components/Input/NumericInput/NumericInput';
import { VectorPropertyProps } from '@/components/Property/Types/VectorProperty/VectorProperty';

export function ValueList({
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
    <Flex gap={'xs'}>
      {value.map((v, i) => (
        <Box miw={70} key={i}>
          <NumericInput
            key={i}
            value={v}
            disabled={disabled}
            min={min[i]}
            max={max[i]}
            step={step[i]}
            onEnter={(newValue) => setValue(i, newValue)}
          />
        </Box>
      ))}
    </Flex>
  );
}
