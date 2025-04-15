import { Grid } from '@mantine/core';

import { NumericInput } from '@/components/Input/NumericInput/NumericInput';
import { PropertyProps } from '@/components/Property/types';
import { useProperty } from '@/types/hooks';

export function MatrixProperty({ uri, readOnly }: PropertyProps) {
  const [value, setPropertyValue, meta] = useProperty('GenericMatrixProperty', uri);

  if (!meta || !value) {
    return <></>;
  }

  const {
    MinimumValue: min,
    MaximumValue: max,
    SteppingValue: step
  } = meta.additionalData;

  const matrixSize = Math.sqrt(value.length);

  function setValue(index: number, newValue: number) {
    if (!value) {
      return;
    }
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
            disabled={readOnly}
          />
        </Grid.Col>
      ))}
    </Grid>
  );
}
