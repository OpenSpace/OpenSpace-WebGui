import { Checkbox, Group } from '@mantine/core';

import { PropertyLabel } from '@/components/Property/PropertyLabel';
import { PropertyProps } from '@/components/Property/types';
import { useProperty } from '@/types/hooks';

export function BoolProperty({ uri, readOnly }: PropertyProps) {
  const [value, setValue, meta] = useProperty('BoolProperty', uri);

  if (value === undefined || !meta) {
    return <></>;
  }

  return (
    <Group gap={'xs'} wrap={'nowrap'}>
      <Checkbox
        checked={value}
        onChange={(event) => setValue(event.currentTarget.checked)}
        onKeyDown={(event) => event.key === 'Enter' && setValue(!value)}
        disabled={readOnly}
        aria-label={`Toggle ${meta.guiName}`}
      />
      <PropertyLabel uri={uri} readOnly={readOnly} />
    </Group>
  );
}
