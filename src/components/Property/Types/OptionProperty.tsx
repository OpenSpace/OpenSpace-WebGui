import { Select } from '@mantine/core';

import { AdditionalDataOptions, PropertyProps } from '@/components/Property/types';
import { useOptionProperty, usePropertyDescription } from '@/hooks/properties';

export function OptionProperty({ uri, readOnly }: PropertyProps) {
  const [value, setValue] = useOptionProperty(uri);
  const description = usePropertyDescription(uri);

  if (!description || value === undefined || !description.additionalData) {
    return <></>;
  }
  console.log(description?.additionalData);

  const { Options: options } = description.additionalData as AdditionalDataOptions;

  // We need to guard for if there are no options. This can happen if they
  // are added dynamically
  if (!options) {
    return <></>;
  }

  return (
    <Select
      aria-label={`${description.name} option input`}
      placeholder={'Choose an option'}
      disabled={readOnly}
      // For each entry in the options object, the numeric value is the key, and the
      // label is the value
      data={Object.entries(options).map(([value, label]) => ({
        value: value,
        label: label
      }))}
      value={value.toString()}
      onChange={(newOption) => newOption && setValue(parseInt(newOption))}
      allowDeselect={false}
    />
  );
}
