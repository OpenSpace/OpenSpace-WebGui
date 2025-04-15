import { Pills } from '@/components/Pills/Pills';
import { PropertyProps } from '@/components/Property/types';
import { useProperty } from '@/types/hooks';

export function StringListProperty({ uri, readOnly }: PropertyProps) {
  const [value, setValue] = useProperty('StringListProperty', uri);

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
