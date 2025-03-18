import { useGetIntListPropertyValue } from '@/api/hooks';
import { Pills } from '@/components/Pills/Pills';
import { PropertyProps } from '@/components/Property/types';

export function IntListProperty({ uri, readOnly }: PropertyProps) {
  const [value, setValue] = useGetIntListPropertyValue(uri);

  if (value === undefined) {
    return <></>;
  }

  function setValueFromString(value: string[]) {
    setValue(value.map((v) => parseInt(v)).filter((item) => !isNaN(item)));
  }

  return (
    <Pills
      value={value.map((v) => v.toString())}
      setValue={setValueFromString}
      placeHolderText={'integer1, integer2, ...'}
      disabled={readOnly}
    />
  );
}
