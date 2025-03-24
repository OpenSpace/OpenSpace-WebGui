import { Grid } from '@mantine/core';

import { NumericInput } from '@/components/Input/NumericInput/NumericInput';
import { AdditionalDataVectorMatrix, PropertyProps } from '@/components/Property/types';
import { useGenericMatrixProperty, usePropertyDescription } from '@/hooks/properties';

export function MatrixProperty({ uri, readOnly }: PropertyProps) {
  const [value, setPropertyValue] = useGenericMatrixProperty(uri);
  const description = usePropertyDescription(uri);

  if (!description || !value) {
    return <></>;
  }

  const additionalData = description.additionalData as AdditionalDataVectorMatrix;
  const { MinimumValue: min, MaximumValue: max, SteppingValue: step } = additionalData;
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
