import { MultiSelect } from '@mantine/core';

import {
  useGetPropertyDescription,
  useGetSelectionPropertyValue,
  usePropListeningState
} from '@/api/hooks';

import { PropertyProps } from '@/components/Property/types';

export function SelectionProperty({ uri }: PropertyProps) {
  const [value, setValue] = useGetSelectionPropertyValue(uri);
  const { value: currentValue, setValue: setCurrentValue } = usePropListeningState<
    string[] | undefined
  >(value);

  const description = useGetPropertyDescription(uri);

  if (!value || !description || currentValue === undefined) {
    return <></>;
  }

  const options = description.additionalData.Options as string[];

  function handleChange(newValue: string[]) {
    setValue(newValue);
    setCurrentValue(newValue);
  }

  return (
    <MultiSelect
      aria-label={`${name} multi-select`}
      disabled={description.additionalData.isReadOnly}
      data={options}
      value={currentValue}
      onChange={handleChange}
      placeholder={value.length === 0 ? 'No selection' : ''}
      searchable
      clearable
    />
  );
}
