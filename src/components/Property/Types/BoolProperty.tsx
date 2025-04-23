import { BoolInput } from '@/components/Input/BoolInput';
import { PropertyProps } from '@/components/Property/types';
import { useBoolProperty, usePropertyDescription } from '@/hooks/properties';

export function BoolProperty({ uri, readOnly }: PropertyProps) {
  const [value, setValue] = useBoolProperty(uri);
  const description = usePropertyDescription(uri);

  if (value === undefined || !description) {
    return <></>;
  }

  return (
    <BoolInput
      value={value}
      setValue={setValue}
      name={description.name}
      description={description.description}
      readOnly={readOnly}
    />
  );
}
