import { Grid } from '@mantine/core';

import { NumericInput } from '@/components/Input/NumericInput/NumericInput';

import { ConcretePropertyBaseProps } from '../types';

interface Props extends ConcretePropertyBaseProps {
  setPropertyValue: (newValue: number[]) => void;
  value: number[];
  additionalData: {
    Exponent: number; // TODO: handle the exponent
    MaximumValue: number[];
    MinimumValue: number[];
    SteppingValue: number[];
  };
}

export function MatrixProperty({
  disabled,
  setPropertyValue,
  value,
  additionalData
}: Props) {
  const min = additionalData.MinimumValue;
  const max = additionalData.MaximumValue;
  const step = additionalData.SteppingValue;
  const matrixSize = Math.sqrt(value.length);

  function setValue(index: number, newValue: number) {
    const v = [...value];
    v[index] = newValue;
    setPropertyValue(v);
  }

  return (
    <Grid gutter={'xs'}>
      {value.map((item, i) => (
        <Grid.Col key={i} span={12 / matrixSize}>
          <NumericInput
            value={item}
            min={min[i]}
            max={max[i]}
            step={step[i]}
            onEnter={(newValue) => setValue(i, newValue)}
            disabled={disabled}
          />
        </Grid.Col>
      ))}
    </Grid>
  );
}
