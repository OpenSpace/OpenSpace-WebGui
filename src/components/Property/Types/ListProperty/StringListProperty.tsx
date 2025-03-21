import { useGetStringListPropertyValue } from '@/api/hooks';
import { Pills } from '@/components/Pills/Pills';
import { PropertyProps } from '@/components/Property/types';

export function StringListProperty({ uri, readOnly }: PropertyProps) {
  const [value, setValue] = useGetStringListPropertyValue(uri);

  if (value === undefined) {
    return <></>;
  }

  return (
    <Pills
      value={value}
      setValue={setValue}
      placeHolderText={'item1, item2, ...'}
      disabled={readOnly}
    />
  );
}
