import { JSX } from 'react';
import { Checkbox, Group, MantineStyleProps } from '@mantine/core';

import { InfoBox } from '@/components/InfoBox/InfoBox';

interface Props extends MantineStyleProps {
  value?: boolean; // This is optional to allow for defaultChecked to work
  setValue: (value: boolean) => void;
  label?: string;
  ariaLabel?: string;
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
  label,
  value,
  setValue,
  ariaLabel,
  defaultChecked,
  info,
  disabled = false,
  ...styleProps
}: Props) {
  if (value === undefined && defaultChecked === undefined) {
    throw new Error('Either value or defaultChecked must be provided');
  }

  if (!label && !ariaLabel) {
    throw new Error('If no label is provided, ariaLabel must be provided');
  }

  return (
    <Group gap={'xs'} wrap={'nowrap'} {...styleProps}>
      <Checkbox
        checked={value}
        onChange={(event) => setValue(event.currentTarget.checked)}
        onKeyDown={(event) => event.key === 'Enter' && setValue(!value)}
        disabled={disabled}
        defaultChecked={defaultChecked}
        label={label}
        aria-label={ariaLabel || label}
      />
      {info && <InfoBox>{info}</InfoBox>}
    </Group>
  );
}
