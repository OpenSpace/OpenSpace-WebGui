import { MultiSelect } from '@mantine/core';

import { PropertyLabel } from '@/components/Property/PropertyLabel';

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
  description,
  disabled,
  setPropertyValue,
  value,
  additionalData
}: Props) {
  const options = additionalData.Options;
  return (
    <MultiSelect
      label={<PropertyLabel label={name} tip={description} isReadOnly={disabled} />}
      disabled={disabled}
      data={options}
      value={value}
      onChange={(_value) => setPropertyValue(_value)}
      searchable
      clearable
    />
  );
}
