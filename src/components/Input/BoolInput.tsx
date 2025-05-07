import { JSX } from 'react';
import { Checkbox, Group, MantineStyleProps } from '@mantine/core';

import { InfoBox } from '../InfoBox/InfoBox';

interface Props extends MantineStyleProps {
  name: string;
  value?: boolean; // This is optional to allow for defaultChecked to work
  setValue: (value: boolean) => void;
  defaultChecked?: boolean;
  info?: string | JSX.Element;
  disabled?: boolean;
}

/**
 * This custom checkbox should be used for all boolean inputs, to make sure that we use a
 * consistent design, always support input using Enter, an provide an aria-label for
 * screen readers.
 */
export function BoolInput({
  value,
  setValue,
  name,
  defaultChecked,
  info,
  disabled = false,
  ...styleProps
}: Props) {
  return (
    <Group gap={'xs'} wrap={'nowrap'} {...styleProps}>
      <Checkbox
        checked={value}
        onChange={(event) => setValue(event.currentTarget.checked)}
        onKeyDown={(event) => event.key === 'Enter' && setValue(!value)}
        disabled={disabled}
        defaultChecked={defaultChecked}
        label={name}
        aria-label={name}
      />
      {info && <InfoBox>{info}</InfoBox>}
    </Group>
  );
}
