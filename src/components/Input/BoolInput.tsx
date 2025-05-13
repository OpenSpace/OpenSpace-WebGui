import { JSX } from 'react';
import { Checkbox, Group, MantineStyleProps } from '@mantine/core';

import { InfoBox } from '@/components/InfoBox/InfoBox';
import { RequireAtLeastOne } from '@/types/types';

interface BaseProps extends MantineStyleProps {
  setValue: (value: boolean) => void;
  info?: string | JSX.Element;
  disabled?: boolean;
}

// Either the label or the ariaLabel must be provided, or both.
interface Label {
  label?: string;
  ariaLabel?: string;
}
type Labels = RequireAtLeastOne<Label, 'label' | 'ariaLabel'>;

// Either the value or the defaultChecked must be provided, but not both.
interface PropsWithValue extends BaseProps {
  value: boolean;
  defaultChecked?: never;
}

interface PropsWithDefault extends BaseProps {
  value: boolean;
  defaultChecked?: never;
}

type Props = (PropsWithValue | PropsWithDefault) & Labels;

/**
 * This custom checkbox should be used for all boolean inputs, to make sure that we use a
 * consistent design, always support input using Enter, and provide an aria-label for
 * screen readers.
 *
 * The aria-label is either set to be the same as the provided `label`, or to a custom
 * value through the `ariaLabel` prop. At least one of these must be provided.
 *
 * Note that either `value` or `defaultChecked` must be provided, but not both. Using
 * `value` will make the checkbox a controlled component, while using `defaultChecked`
 * will make it uncontrolled.
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
  if (!label && !ariaLabel) {
    throw new Error('A non-empty ariaLabel or label must be provided');
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
