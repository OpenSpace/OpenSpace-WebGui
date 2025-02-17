import { Grid } from '@mantine/core';

import { NumericInput } from '@/components/Input/NumericInput/NumericInput';
import { PropertyLabel } from '@/components/Property/PropertyLabel';

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
  };
}

export function MatrixProperty({
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
  const matrixSize = Math.sqrt(value.length);

  function setValue(index: number, newValue: number) {
    const v = [...value];
    v[index] = newValue;
    setPropertyValue(v);
  }

  return (
    <>
      <PropertyLabel label={name} tip={description} />
      <Grid gutter={'xs'}>
        {value.map((v, i) => (
          <Grid.Col key={i} span={12 / matrixSize}>
            <NumericInput
              value={v}
              min={min[i]}
              max={max[i]}
              step={step[i]}
              onEnter={(newValue) => setValue(i, newValue)}
              disabled={disabled}
            />
          </Grid.Col>
        ))}
      </Grid>
    </>
  );
}
