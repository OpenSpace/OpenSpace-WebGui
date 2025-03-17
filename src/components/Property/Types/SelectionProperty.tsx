import { MultiSelect } from '@mantine/core';

import { PropertyProps } from '../types';
import { useGetPropertyDescription, useGetSelectionPropertyValue } from '@/api/hooks';

export function SelectionProperty({ uri }: PropertyProps) {
  const [value, setValue] = useGetSelectionPropertyValue(uri);
  const description = useGetPropertyDescription(uri);

  if (!value || !description) {
    return <></>;
  }

  const options = description.additionalData.Options as string[];

  return (
    <MultiSelect
      aria-label={`${name} multi-select`}
      disabled={description.additionalData.isReadOnly}
      data={options}
      value={value}
      onChange={setValue}
      placeholder={value.length === 0 ? 'No selection' : ''}
      searchable
      clearable
    />
  );
}
