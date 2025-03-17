import { Select } from '@mantine/core';

import { PropertyProps } from '../types';
import { useGetOptionPropertyValue, useGetPropertyDescription } from '@/api/hooks';

interface Option {
  [key: string]: string; // OBS! The key is a number, but will always be converted to a string...
}

export function OptionProperty({ uri }: PropertyProps) {
  const [value, setValue] = useGetOptionPropertyValue(uri);
  const description = useGetPropertyDescription(uri);

  if (!description || value === undefined) {
    return <></>;
  }

  const data = description.additionalData.Options;

  // TODO: This is a bit nasty... Only gets the first value. We should consider simplifying
  // the data structure to not be an array. I ended up doing this and flipping the data
  // structure to make  it easier to get the correpsonding value for a given string
  const options = data.reduce((acc: { [key: string]: number }, option: Option) => {
    const [key] = Object.values(option); // Gets the first value in the object
    const value = parseInt(Object.keys(option)[0]);
    acc[key] = value;
    return acc;
  }, {});

  // Value will be an integer number. We need to find the string version to use in the
  // select component
  function valueToString(value: number): string | undefined {
    return Object.keys(options).find((key) => options[key] === value);
  }

  function onChange(option: string | null) {
    if (option) {
      setValue(options[option]);
    }
  }

  return (
    <Select
      aria-label={`${name} option input`}
      placeholder={'Choose an option'}
      disabled={description.additionalData.isReadOnly}
      data={Object.keys(options)}
      value={valueToString(value)}
      onChange={onChange}
      allowDeselect={false}
    />
  );
}
