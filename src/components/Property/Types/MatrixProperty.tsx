import { Grid } from '@mantine/core';

import { NumericInput } from '@/components/Input/NumericInput/NumericInput';
import { AdditionalDataVectorMatrix, PropertyProps } from '@/components/Property/types';
import { usePropertyDescription } from '@/hooks/properties';
import { useProperty } from '@/types/property';

export function MatrixProperty({ uri, readOnly }: PropertyProps) {
  //const [value, setPropertyValue] = useGenericMatrixProperty(uri);
  const description = usePropertyDescription(uri);
  const [value, setPropertyValue] = useProperty('DMat2Property', uri);

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
