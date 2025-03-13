import { MultiSelect } from '@mantine/core';

import { ConcretePropertyBaseProps } from '../types';

interface Props extends ConcretePropertyBaseProps {
  setPropertyValue: (newValue: string[]) => void;
  additionalData: {
    Options: string[];
  };
  value: string[];
}

export function SelectionProperty({
  name,
  disabled,
  setPropertyValue,
  value,
  additionalData
}: Props) {
  const options = additionalData.Options;
  return (
    <MultiSelect
      aria-label={`${name} multi-select`}
      disabled={disabled}
      data={options}
      value={value}
      onChange={(_value) => setPropertyValue(_value)}
      placeholder={value.length === 0 ? 'No selection' : ''}
      searchable
      clearable
    />
  );
}
