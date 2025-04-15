import { Select } from '@mantine/core';

import { PropertyProps } from '@/components/Property/types';
import { useProperty } from '@/hooks/properties';

export function OptionProperty({ uri, readOnly }: PropertyProps) {
  const [value, setValue, meta] = useProperty('OptionProperty', uri);

  if (!meta || value === undefined || !meta.additionalData) {
    return <></>;
  }

  const options = meta.additionalData.Options;

  // We need to guard for if there are no options. This can happen if they
  // are added dynamically
  if (!options) {
    return (
      <Select
        aria-label={`${meta.guiName} option input`}
        placeholder={'No options were loaded'}
        disabled
      />
    );
  }

  return (
    <Select
      aria-label={`${meta.guiName} option input`}
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
