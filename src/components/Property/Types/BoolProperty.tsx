import { Checkbox, Group } from '@mantine/core';

import { PropertyLabel } from '../PropertyLabel';
import { ConcretePropertyBaseProps } from '../types';

interface Props extends ConcretePropertyBaseProps {
  setPropertyValue: (newValue: boolean) => void;
  value: boolean;
}

export function BoolProperty({
  name,
  description,
  disabled,
  setPropertyValue,
  value
}: Props) {
  return (
    <Group gap={'xs'}>
      <Checkbox
        checked={value}
        onChange={(event) => setPropertyValue(event.currentTarget.checked)}
        onKeyDown={(event) => event.key === 'Enter' && setPropertyValue(!value)}
        disabled={disabled}
        aria-label={`Toggle ${name}`}
      />
      <PropertyLabel label={name} tip={description} isReadOnly={disabled} />
    </Group>
  );
}
