import { JSX } from 'react';
import { Checkbox, Group } from '@mantine/core';

import { InfoBox } from '../InfoBox/InfoBox';

interface Props {
  name: string;
  value: boolean;
  setValue: (value: boolean) => void;
  info?: string | JSX.Element;
  disabled?: boolean;
}

/**
 * This custom checkbox should be used for all boolean inputs, to make sure that we use a
 * consistent design, always support input using Enter, an provide an aria-label for
 * screen readers.
 */
export function BoolInput({ value, setValue, name, info, disabled = false }: Props) {
  return (
    <Group gap={'xs'} wrap={'nowrap'}>
      <Checkbox
        checked={value}
        onChange={(event) => setValue(event.currentTarget.checked)}
        onKeyDown={(event) => event.key === 'Enter' && setValue(!value)}
        disabled={disabled}
        label={name}
        aria-label={name}
      />
      {info && <InfoBox>{info}</InfoBox>}
    </Group>
  );
}
