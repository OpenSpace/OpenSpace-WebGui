import { Checkbox, Group } from '@mantine/core';

import { useGetBoolPropertyValue } from '@/api/hooks';
import { PropertyLabel } from '@/components/Property/PropertyLabel';
import { PropertyProps } from '@/components/Property/types';

export function BoolProperty({ uri, readOnly }: PropertyProps) {
  const [value, setValue] = useGetBoolPropertyValue(uri);

  if (value === undefined) {
    return <></>;
  }

  return (
    <Group gap={'xs'} wrap={'nowrap'}>
      <Checkbox
        checked={value}
        onChange={(event) => setValue(event.currentTarget.checked)}
        onKeyDown={(event) => event.key === 'Enter' && setValue(!value)}
        disabled={readOnly}
        aria-label={`Toggle ${name}`}
      />
      <PropertyLabel uri={uri} readOnly={readOnly} />
    </Group>
  );
}
