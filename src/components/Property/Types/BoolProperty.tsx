import { Checkbox, Group } from '@mantine/core';

import { PropertyLabel } from '../PropertyLabel';

interface Props {
  name: string;
  description: string;
  disabled: boolean;
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
    <Group>
      <Checkbox
        checked={value}
        onChange={(event) => setPropertyValue(event.currentTarget.checked)}
        onKeyDown={(event) => event.key === 'Enter' && setPropertyValue(!value)}
        disabled={disabled}
        label={<PropertyLabel label={name} tip={description} />}
      />
    </Group>
  );
}
