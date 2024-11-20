import { Select } from '@mantine/core';

import { PropertyLabel } from '@/components/Property/PropertyLabel';

interface Option {
  [key: string]: string; // OBS! The key is a number, but will always be converted to a string...
}

interface Props {
  name: string;
  description: string;
  disabled: boolean;
  setPropertyValue: (newValue: number) => void;
  value: number;
  additionalData: {
    Options: Option[];
  };
}

export function OptionProperty({
  name,
  description,
  disabled,
  setPropertyValue,
  value,
  additionalData
}: Props) {
  const data = additionalData.Options;

  // TODO: This is a bit nasty... Only gets the first value. We should consider simplifying
  // the data structure to not be an array. I ended up doing this and flipping the data
  // structure to make  it easier to get the correpsonding value for a given string
  const options: { [key: string]: number } = {};
  data.forEach((option: Option) => {
    const [key] = Object.values(option); // Gets the first value in the object
    const value = parseInt(Object.keys(option)[0]);
    options[key] = value;
  });

  // Value will be an integer number. We need to find the string version to use in the
  // select component
  function valueToString(value: number): string | undefined {
    return Object.keys(options).find((key) => options[key] === value);
  }

  function onChange(option: string | null) {
    if (option) {
      setPropertyValue(options[option]);
    }
  }

  return (
    <Select
      label={<PropertyLabel label={name} tip={description} />}
      placeholder={'Choose an option'}
      disabled={disabled}
      data={Object.keys(options)}
      value={valueToString(value)}
      onChange={(_value) => onChange(_value)}
      allowDeselect={false}
    />
  );
}
