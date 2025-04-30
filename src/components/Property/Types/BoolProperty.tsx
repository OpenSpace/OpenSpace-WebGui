import { BoolInput } from '@/components/Input/BoolInput';
import { PropertyProps } from '@/components/Property/types';
import { useProperty } from '@/hooks/properties';

import { PropertyLabel } from '../PropertyLabel';

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
      description={meta.description}
      disabled={readOnly}
      label={
        <PropertyLabel
          name={meta.guiName}
          description={meta.description}
          uri={uri}
          readOnly={readOnly}
        />
      }
    />
  );
}
