import { Checkbox, Group } from '@mantine/core';

import { PropertyLabel } from '../PropertyLabel';
import { PropertyProps } from '../types';
import { useGetBoolPropertyValue, useGetPropertyDescription } from '@/api/hooks';

export function BoolProperty({ uri }: PropertyProps) {
  const [value, setValue] = useGetBoolPropertyValue(uri);
  const description = useGetPropertyDescription(uri);

  if (!description || value === undefined) {
    return <></>;
  }

  return (
    <Group gap={'xs'} wrap={'nowrap'}>
      <Checkbox
        checked={value}
        onChange={(event) => setValue(event.currentTarget.checked)}
        onKeyDown={(event) => event.key === 'Enter' && setValue(!value)}
        disabled={description.metaData.isReadOnly}
        aria-label={`Toggle ${name}`}
      />
      <PropertyLabel uri={uri} />
    </Group>
  );
}
