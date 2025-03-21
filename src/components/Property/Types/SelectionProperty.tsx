import { MultiSelect } from '@mantine/core';
import {
  useGetPropertyDescription,
  useGetSelectionPropertyValue} from 'src/hooks/properties';
import { usePropListeningState } from 'src/hooks/util';

import { AdditionalDataSelection, PropertyProps } from '@/components/Property/types';

export function SelectionProperty({ uri, readOnly }: PropertyProps) {
  const [value, setValue] = useGetSelectionPropertyValue(uri);
  const { value: currentValue, setValue: setCurrentValue } = usePropListeningState<
    string[] | undefined
  >(value);

  const description = useGetPropertyDescription(uri);

  if (!value || !description || currentValue === undefined) {
    return <></>;
  }

  const { Options: options } = description.additionalData as AdditionalDataSelection;

  function handleChange(newValue: string[]) {
    setValue(newValue);
    setCurrentValue(newValue);
  }

  return (
    <MultiSelect
      aria-label={`${description.name} multi-select`}
      disabled={readOnly}
      data={options}
      value={currentValue}
      onChange={handleChange}
      placeholder={value.length === 0 ? 'No selection' : ''}
      searchable
      clearable
    />
  );
}
