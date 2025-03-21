import { Select } from '@mantine/core';

import { useGetOptionPropertyValue, useGetPropertyDescription } from '@/api/hooks';
import { AdditionalDataOptions, PropertyProps } from '@/components/Property/types';

export function OptionProperty({ uri, readOnly }: PropertyProps) {
  const [value, setValue] = useGetOptionPropertyValue(uri);
  const description = useGetPropertyDescription(uri);

  if (!description || value === undefined) {
    return <></>;
  }

  const { Options: data } = description.additionalData as AdditionalDataOptions;

  // Get the name of the option, e.g. "Option 1"
  // Flatten the array as otherwise each element is an array
  // @TODO (ylvse 2025-03-18): Change the property format
  const options = data.map((option) => Object.values(option)).flat();

  function onChange(option: string | null) {
    if (option && options.indexOf(option) !== -1) {
      // Now we need to find the number key of the option
      // which is the same as its index in the optionsStrings array
      const index = options.indexOf(option);
      setValue(index);
    }
  }

  return (
    <Select
      aria-label={`${description.name} option input`}
      placeholder={'Choose an option'}
      disabled={readOnly}
      data={options}
      value={options[value]}
      onChange={onChange}
      allowDeselect={false}
    />
  );
}
