import { JSX } from 'react';
import { Checkbox, Group } from '@mantine/core';

import { Label } from '../Label/Label';

interface Props {
  name: string;
  description: string | JSX.Element;
  value: boolean;
  setValue: (value: boolean) => void;
  readOnly?: boolean;
}

export function BoolInput({
  value,
  setValue,
  name,
  description,
  readOnly = false
}: Props) {
  return (
    <Group gap={'xs'} wrap={'nowrap'}>
      <Checkbox
        checked={value}
        onChange={(event) => setValue(event.currentTarget.checked)}
        onKeyDown={(event) => event.key === 'Enter' && setValue(!value)}
        disabled={readOnly}
        aria-label={name}
      />
      <Label name={name} description={description} readOnly={readOnly} />
    </Group>
  );
}
