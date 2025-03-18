import { Select } from '@mantine/core';

import { useGetOptionPropertyValue, useGetPropertyDescription } from '@/api/hooks';
import { PropertyProps } from '@/components/Property/types';

// In OpenSpace the options are represented like so:
// { 0 : "Option 1"}, { 1: "Option 2"}
// The key is a number but in a string format.
interface Option {
  [key: string]: string;
}

export function OptionProperty({ uri, readOnly }: PropertyProps) {
  const [value, setValue] = useGetOptionPropertyValue(uri);
  const description = useGetPropertyDescription(uri);

  if (!description || value === undefined) {
    return <></>;
  }
  const data: Option[] = description.additionalData.Options;

  // Get the name of the option, e.g. "Option 1"
  const optionsStrings = data.map((option) => Object.values(option)[0]);

  function onChange(option: string | null) {
    if (option && optionsStrings.indexOf(option) !== -1) {
      // Now we need to find the number key of the option
      // which is the same as its index in the optionsStrings array
      const index = optionsStrings.indexOf(option);
      setValue(index);
    }
  }

  return (
    <Select
      aria-label={`${name} option input`}
      placeholder={'Choose an option'}
      disabled={readOnly}
      data={optionsStrings}
      value={optionsStrings[value]}
      onChange={onChange}
      allowDeselect={false}
    />
  );
}
