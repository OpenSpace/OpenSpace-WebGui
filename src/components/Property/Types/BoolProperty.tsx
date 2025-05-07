import { BoolInput } from '@/components/Input/BoolInput';
import { PropertyProps } from '@/components/Property/types';
import { useProperty } from '@/hooks/properties';

export function BoolProperty({ uri, readOnly }: PropertyProps) {
  const [value, setValue, meta] = useProperty('BoolProperty', uri);

  if (value === undefined || !meta) {
    return <></>;
  }

  return (
    <BoolInput
      value={value}
      setValue={setValue}
      name={meta.guiName}
      info={meta.description}
      disabled={readOnly}
    />
  );
}
