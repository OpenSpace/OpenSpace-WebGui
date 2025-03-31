import { Checkbox, Group } from '@mantine/core';

import { PropertyLabel } from '@/components/Property/PropertyLabel';
import { PropertyProps } from '@/components/Property/types';
import { useBoolProperty, usePropertyDescription } from '@/hooks/properties';

export function BoolProperty({ uri, readOnly }: PropertyProps) {
  const [value, setValue] = useBoolProperty(uri);
  const description = usePropertyDescription(uri);

  if (value === undefined || !description) {
    return <></>;
  }

  return (
    <Group gap={'xs'} wrap={'nowrap'}>
      <Checkbox
        checked={value}
        onChange={(event) => setValue(event.currentTarget.checked)}
        onKeyDown={(event) => event.key === 'Enter' && setValue(!value)}
        disabled={readOnly}
        aria-label={`Toggle ${description.name}`}
      />
      <PropertyLabel uri={uri} readOnly={readOnly} />
    </Group>
  );
}
