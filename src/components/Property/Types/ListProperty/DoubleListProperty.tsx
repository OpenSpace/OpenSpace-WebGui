import { Pills } from '@/components/Pills/Pills';
import { PropertyProps } from '@/components/Property/types';
import { useDoubleListProperty } from '@/hooks/properties';

export function DoubleListProperty({ uri, readOnly }: PropertyProps) {
  const [value, setValue] = useDoubleListProperty(uri);

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
