import { Checkbox, Group } from '@mantine/core';
import { useGetBoolPropertyValue, useGetPropertyDescription } from 'src/hooks/properties';

import { PropertyLabel } from '@/components/Property/PropertyLabel';
import { PropertyProps } from '@/components/Property/types';

export function BoolProperty({ uri, readOnly }: PropertyProps) {
  const [value, setValue] = useGetBoolPropertyValue(uri);
  const description = useGetPropertyDescription(uri);

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
