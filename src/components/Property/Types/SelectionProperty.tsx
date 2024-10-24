import { Group, InputLabel, MultiSelect } from '@mantine/core';

import { Tooltip } from '@/components/Tooltip/Tooltip';

interface Props {
  name: string;
  description: string;
  disabled: boolean;
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
      label={
        <Group>
          <InputLabel>{name}</InputLabel>
          <Tooltip text={description} />
        </Group>
      }
      disabled={disabled}
      data={options}
      value={value}
      onChange={(_value) => setPropertyValue(_value)}
      searchable
      clearable
    />
  );
}
