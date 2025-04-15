import { Pills } from '@/components/Pills/Pills';
import { PropertyProps } from '@/components/Property/types';
import { useProperty } from '@/types/hooks';

export function DoubleListProperty({ uri, readOnly }: PropertyProps) {
  const [value, setValue] = useProperty('DoubleListProperty', uri);

  if (value === undefined) {
    return <></>;
  }

  function setValueString(values: string[]) {
    setValue(values.map((value) => parseFloat(value)).filter((value) => !isNaN(value)));
  }

  return (
    <Pills
      value={value.map((v) => v.toString())}
      setValue={setValueString}
      placeHolderText={'number1, number2, ...'}
      disabled={readOnly}
    />
  );
}
