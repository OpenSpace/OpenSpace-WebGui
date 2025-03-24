import { Pills } from '@/components/Pills/Pills';
import { PropertyProps } from '@/components/Property/types';
import { useIntListProperty } from '@/hooks/properties';

export function IntListProperty({ uri, readOnly }: PropertyProps) {
  const [value, setValue] = useIntListProperty(uri);

  if (value === undefined) {
    return <></>;
  }

  function setValueFromString(values: string[]) {
    setValue(values.map((value) => parseInt(value)).filter((value) => !isNaN(value)));
  }

  return (
    <Pills
      value={value.map((value) => value.toString())}
      setValue={setValueFromString}
      placeHolderText={'integer1, integer2, ...'}
      disabled={readOnly}
    />
  );
}
