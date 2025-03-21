import { useGetDoubleListPropertyValue } from '@/api/hooks';
import { Pills } from '@/components/Pills/Pills';
import { PropertyProps } from '@/components/Property/types';

export function DoubleListProperty({ uri, readOnly }: PropertyProps) {
  const [value, setValue] = useGetDoubleListPropertyValue(uri);

  if (value === undefined) {
    return <></>;
  }

  function setValueString(value: string[]) {
    setValue(value.map((item) => parseFloat(item)).filter((item) => !isNaN(item)));
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
