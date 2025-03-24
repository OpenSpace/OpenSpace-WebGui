import { Select } from '@mantine/core';

import { AdditionalDataOptions, PropertyProps } from '@/components/Property/types';
import { useOptionProperty, usePropertyDescription } from '@/hooks/properties';

export function OptionProperty({ uri, readOnly }: PropertyProps) {
  const [value, setValue] = useOptionProperty(uri);
  const description = usePropertyDescription(uri);

  if (!description || value === undefined) {
    return <></>;
  }

  const { Options: data } = description.additionalData as AdditionalDataOptions;

  return (
    <Select
      aria-label={`${description.name} option input`}
      placeholder={'Choose an option'}
      disabled={readOnly}
      data={Object.entries(data).map(([value, label]) => {
        return { value: value, label: label };
      })}
      value={value.toString()}
      onChange={(newOption) => newOption && setValue(parseInt(newOption))}
      allowDeselect={false}
    />
  );
}
