import { BoolInput } from '@/components/Input/BoolInput';
import { PropertyProps } from '@/components/Property/types';
import { useProperty } from '@/hooks/properties';

import { PropertyDescription } from '../PropertyDescription';

export function BoolProperty({ uri, readOnly }: PropertyProps) {
  const [value, setValue, meta] = useProperty('BoolProperty', uri);

  if (value === undefined || !meta) {
    return <></>;
  }

  return (
    <BoolInput
      value={value}
      onChange={setValue}
      label={meta.guiName}
      info={
        <PropertyDescription
          uri={uri}
          description={meta.description}
          visibility={meta.visibility}
        />
      }
      disabled={readOnly}
    />
  );
}
