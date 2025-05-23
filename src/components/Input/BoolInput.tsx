import { Checkbox, Group, MantineStyleProps } from '@mantine/core';

import { InfoBox } from '@/components/InfoBox/InfoBox';
import { RequireAtLeastOne } from '@/types/types';

// @TODO (2025-05-15, emmbr): We should consider extending the Mantine Checkbox component
// here, to support the same props as the native checkbox, such as `indeterminate` and
// `required`. This would make the BoolInput component more flexible and consistent with
// the native checkbox behavior. However, that also requires effort to ensure that the
// component behaves correctly with these props, so leaving for now

interface BaseProps extends MantineStyleProps {
  onChange?: (value: boolean) => void;
  info?: React.ReactNode;
  disabled?: boolean;
}

// Either the label or the ariaLabel must be provided, or both
interface Label {
  label?: string;
  ariaLabel?: string;
}
type Labels = RequireAtLeastOne<Label, 'label' | 'ariaLabel'>;

// If value is provided, defaultChecked must not be provided
interface PropsWithValue extends BaseProps {
  value: boolean;
  defaultChecked?: never;
}

// If defaultChecked is provided, value must not be provided, but it's also possible to
// not specify either, in which case defaultChecked will be considered false by default
interface PropsWithDefault extends BaseProps {
  defaultChecked?: boolean;
  value?: never;
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
 * will make it uncontrolled. Not specifying either means that `defaultChecked` will be
 * `false` by default.
 */
export function BoolInput({
  label,
  value,
  onChange,
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
        onChange={(event) => onChange?.(event.currentTarget.checked)}
        onKeyDown={(event) => event.key === 'Enter' && onChange?.(!value)}
        disabled={disabled}
        defaultChecked={defaultChecked}
        label={label}
        aria-label={ariaLabel || label}
      />
      {info && <InfoBox>{info}</InfoBox>}
    </Group>
  );
}
