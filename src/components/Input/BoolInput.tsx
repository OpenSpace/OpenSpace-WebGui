import { JSX } from 'react';
import { Checkbox, Group } from '@mantine/core';

import { Label } from '../Label/Label';

interface Props {
  name: string;
  description: string | JSX.Element;
  value: boolean;
  setValue: (value: boolean) => void;
  label?: JSX.Element;
  disabled?: boolean;
}

export function BoolInput({
  value,
  setValue,
  name,
  description,
  label,
  disabled = false
}: Props) {
  return (
    <Group gap={'xs'} wrap={'nowrap'}>
      <Checkbox
        checked={value}
        onChange={(event) => setValue(event.currentTarget.checked)}
        onKeyDown={(event) => event.key === 'Enter' && setValue(!value)}
        disabled={disabled}
        aria-label={name}
      />
      {label || <Label name={name} description={description} />}
    </Group>
  );
}
